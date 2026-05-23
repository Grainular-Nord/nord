import { type WritableGrain, grain } from '@grainular/grains';

const rows = 50;
const cols = 50;
const gensPerSecond = 25;
const maxStashEntries = 50;

const cells: WritableGrain<boolean>[][] = Array.from({ length: cols }, () => {
    return Array.from({ length: rows }, () => {
        return grain(false);
    });
});

// alive is maintained as a write-through cache rather than derived
// from cells directly. Using combined(cells.flat()) tanks performance
// at >10k cells. All mutations to cells must update alive accordingly.
const alive = grain(0);
const running = grain(false);
const generation = grain(0);
const stash = grain<boolean[][][]>([]);

// -- Internal State Processors
const updateAliveCells = (amount: number) => alive.set(alive() + amount);

// Convenience Helper to iterate all cells
// using a callback fn provided
const iterateCells = (itt: (cell: WritableGrain<boolean>, pos: [x: number, y: number]) => void) => {
    cells.forEach((row, idx) => {
        row.forEach((cell, idy) => {
            itt(cell, [idx, idy]);
        });
    });
};

// Convenience Helper to retrieve all
// neighbors of a given cell.
const getCellNeighbors = ([x, y]: [x: number, y: number]) => {
    const indices = [-1, 0, 1];
    return indices.flatMap((idx) =>
        indices.map((idy) => {
            // Skip self
            if (idx === 0 && idy === 0) return;
            return cells[x + idx]?.[y + idy];
        }),
    );
};

// Calculates the next state of a cell based
// on it's current state and neighbors
const getNextCellState = (state: WritableGrain<boolean>, cellId: [x: number, y: number]) => {
    const neighbors = getCellNeighbors(cellId);
    const aliveNeighbors = neighbors.filter((neighbor) => neighbor?.());

    if (state()) {
        // Rule 1, 2, & 3: A live cell only survives if it has 2 or 3 neighbors.
        // Otherwise, it dies (under-population or overpopulation).
        return aliveNeighbors.length === 2 || aliveNeighbors.length === 3;
    }

    // Rule 4: A dead cell only comes to life if it has exactly 3 neighbors.
    // Otherwise, it stays dead.
    return aliveNeighbors.length === 3;
};

const nextSimulationStep = () => {
    generation.set(generation() + 1);
    // Stash the state as the latest snapshot, and
    // truncate if longer then maxStashEntries
    stash.update((current) => {
        const nextStash = [...current, cells.map((row) => row.map((cell) => cell()))];
        if (nextStash.length > maxStashEntries) nextStash.shift();
        return nextStash;
    });

    // Find next cell state by applying
    // the game rules against the cell
    const nextBatch = cells.map((col, idx) => {
        return col.map((cell, idy) => {
            return getNextCellState(cell, [idx, idy]);
        });
    });

    // Apply state while tracking the number
    // of alive cells remaining.
    let trackAlive = 0;
    iterateCells((cell, [x, y]) => {
        cell.set(nextBatch[x][y]);
        nextBatch[x][y] && trackAlive++;
    });

    // We set the alive cell count once to avoid unnecessary updates.
    // This means that the alive counter lags behind
    // the actual alive cells (as they are intermittently set)
    // but is up to date enough to be useful
    alive.set(trackAlive);
};

const previousSimulationStep = () => {
    running.set(false);
    generation.set(generation() - 1);

    // Retrieve the latest entry and keep track
    // of the rest of the elements to update the stash
    // accordingly
    const [lastBatch, ...rest] = stash().toReversed();
    if (!lastBatch) return;

    let trackAlive = 0;
    iterateCells((cell, [x, y]) => {
        cell.set(lastBatch[x][y]);
        lastBatch[x][y] && trackAlive++;
    });

    alive.set(trackAlive);
    stash.set(rest.toReversed());
};

const stepThroughSimulation = () => {
    if (!running()) return;

    nextSimulationStep();

    window.setTimeout(() => {
        window.requestAnimationFrame(() => {
            stepThroughSimulation();
        });
    }, 1000 / gensPerSecond);
};

// Setup and start the simulation.
// Returns a cleanup function that stops any
// further simulation steps
const runSimulation = () => {
    window.requestAnimationFrame(() => stepThroughSimulation());
    return () => running.set(false);
};

// Control Actions
const toggleCell = (state: WritableGrain<boolean>) => {
    const next = !state();
    state.set(next);
    updateAliveCells(next ? 1 : -1);
};

const startSimulation = () => {
    if (!running()) {
        running.set(true);
        runSimulation();
    }
};

const stopSimulation = () => {
    running.set(false);
};

const resetSimulation = () => {
    running.set(false);
    alive.set(0);
    generation.set(0);
    stash.set([]);
    iterateCells((cell) => cell.set(false));
};

const randomizeCells = () => {
    resetSimulation();
    let trackAlive = 0;
    for (const row of cells) {
        for (const cell of row) {
            const state = !!Math.round(Math.random() - 0.25);
            cell.set(state);
            state && trackAlive++;
        }
    }
    alive.set(trackAlive);
};

export const simulationState = {
    actions: {
        resetSimulation,
        startSimulation,
        nextSimulationStep,
        previousSimulationStep,
        stopSimulation,
        randomizeCells,
        toggleCell,
    },
    parameters: { rows, cols, gensPerSecond },
    state: { cells, running, generation, alive, stash },
};
