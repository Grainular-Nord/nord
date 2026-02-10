import { type WritableGrain, grain, readonly } from '@grainular/grains';
import { timer } from './timer-state';

export type Cell = {
    discovered: WritableGrain<boolean>;
    explosive: WritableGrain<boolean>;
    flagged: WritableGrain<boolean>;
    neighbors: WritableGrain<number | null>;
};

const createField = (size: number): Cell[] => {
    return Array.from({ length: size * size }, () => {
        return {
            discovered: grain(false),
            explosive: grain(false),
            flagged: grain(false),
            neighbors: grain<number | null>(null),
        };
    });
};

const state = grain<'stopped' | 'pending' | 'initialized'>('pending');
export const size = grain(10);
export const mines = grain(10);
const cells = grain<Cell[]>(createField(size()));
const result = grain(false);
state.subscribe((state) => {
    if (state === 'stopped') return timer.resetTimer();
    if (timer.state() === 'stopped') return timer.startTimer();
});

timer.time.subscribe((time) => {
    if (time === 0) {
        state.set('stopped');
        result.set(false);
    }
});

const getNeighbors = (cells: Cell[], center: Cell, size: number): Cell[] => {
    const index = cells.indexOf(center);
    const x = index % size;
    const y = Math.floor(index / size);

    const offsets = [
        [-1, -1],
        [0, -1],
        [1, -1],
        [-1, 0],
        [1, 0],
        [-1, 1],
        [0, 1],
        [1, 1],
    ];

    const neighbors: Cell[] = [];

    for (const [dx, dy] of offsets) {
        const nx = x + dx;
        const ny = y + dy;

        if (nx < 0 || nx >= size || ny < 0 || ny >= size) {
            continue;
        }

        const neighbor = cells[ny * size + nx];
        if (neighbor === undefined) {
            continue;
        }

        neighbors.push(neighbor);
    }

    return neighbors;
};

const checkCellEffect = (cell: Cell, cells: Cell[], size: number) => {
    // Early returns for invalid interactions
    if (cell.flagged() || cell.discovered()) return;

    // Direct bomb hit
    if (cell.explosive()) {
        cell.discovered.set(true);
        return;
    }

    cell.discovered.set(true);

    // Trigger flood fill if cell has no neighbors
    if (cell.neighbors() === null) {
        discoverUnambiguousCells(cell, cells, size);
    }
};

const checkGameState = (cells: readonly Cell[], mines: number) => {
    if (state() !== 'initialized') return;

    const isBombDiscovered = cells.some((cell) => cell.explosive() && cell.discovered());

    // Loss Path
    if (isBombDiscovered) {
        state.set('stopped');
        result.set(false);
        for (const cell of cells) {
            // Reveal all mines so the player sees what they missed
            if (cell.explosive()) {
                cell.discovered.set(true);
            }
        }
        return;
    }

    const undiscoveredCount = cells.filter((cell) => !cell.discovered()).length;
    const allNonMinesFound = undiscoveredCount === mines;
    const allMinesFlagged = cells.every((cell) => (cell.explosive() ? cell.flagged() : !cell.flagged()));

    // Victory Path
    if (allNonMinesFound || allMinesFlagged) {
        state.set('stopped');
        result.set(true);
        // Clean up the board by flagging remaining mines
        for (const cell of cells) {
            if (cell.explosive()) {
                cell.flagged.set(true);
            }
        }
    }
};

const discoverUnambiguousCells = (center: Cell, cells: readonly Cell[], size: number) => {
    const queue: Cell[] = [center];
    const visited = new Set<Cell>();

    while (queue.length > 0) {
        const current = queue.shift();
        if (!current || visited.has(current)) continue;

        visited.add(current);
        current.discovered.set(true);

        // Stop expansion at the boundary of the "empty" area
        // We still discover the numbered cell, but don't add its neighbors
        if (current.neighbors() !== null) continue;

        for (const neighbor of getNeighbors(cells as Cell[], current, size)) {
            if (neighbor.discovered() || neighbor.flagged()) continue;
            queue.push(neighbor);
        }
    }
};

const initializeState = (cells: Cell[], mines: number, origin: number, size: number) => {
    // To initialize the field, we want to distribute
    // a number of mines inside the field, according to the
    // current number of mines. We do this by creating an
    // array of indexes, and consuming randomly from those
    // indexes, until we have either created the desired
    // amount of mineIndices, or there are no indices to
    // place left (meaning, 100% of the field is mines.
    // (size * size < mines)) which is a user issue
    const indices = Array.from({ length: cells.length }, (_, idx) => idx).filter((_, idx) => idx !== origin);
    const mineIndices: number[] = [];
    while (mineIndices.length < mines && indices.length > 0) {
        mineIndices.push(...indices.splice(Math.floor(Math.random() * indices.length), 1));
    }

    // After generating the indices set, we iterate the indices
    // and set each cell at the index to `explosive`
    for (const idx of mineIndices) {
        cells.at(idx)?.explosive.set(true);
    }

    // After placing the mines, we want to calculate the
    // number of mines the cell has as neighbor. For that,
    // we can simply iterate all cells, get the neighbors,
    // and get the length of mines in the neighbors array
    for (const cell of cells) {
        if (cell.explosive()) continue;
        const neighbors = getNeighbors(cells, cell, size);
        const mines = neighbors.filter((cell) => cell.explosive());
        cell.neighbors.set(mines.length || null);
    }
};

export const gameState = {
    state: readonly(state),
    cells: readonly(cells),
    size: readonly(size),
    result: readonly(result),
    time: readonly(timer.time),
    reset: () => {
        result.set(false);
        state.set('pending');
        timer.resetTimer();
        cells.set(createField(size()));
    },
    handleCellClick: (cell: Cell) => {
        // If the state is stopped, we can completely
        // ignore this clicked
        if (state() === 'stopped') return;

        // If this is the first click of the match,
        // we initialize the minefield
        if (state() === 'pending') {
            const origin = cells().findIndex((pred) => pred === cell);
            initializeState(cells(), mines(), origin, size());
            state.set('initialized');
        }

        // We now know that the state is initialized, we
        // have a minefield, and need to check which effects
        // the click has.
        checkCellEffect(cell, cells(), size());
        checkGameState(cells(), mines());
    },
};

timer.setTimer(999);
