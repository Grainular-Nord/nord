import { type WritableGrain, grain } from '@grainular/grains';

export const rows = 200;
export const cols = 200;
export const gensPerSecond = 25;

const cells: WritableGrain<boolean>[][] = Array.from({ length: cols }, () => {
    return Array.from({ length: rows }, () => {
        return grain(false);
    });
});

const running = grain(false);
const generation = grain(0);
const alive = grain(0);

const getCellNeighbors = (cellId: [x: number, y: number]) => {
    const [x, y] = cellId;
    // Neighbors are available here:
    // -1/-1    0/-1    +1/-1
    // -1/0     O/0     +1/0
    // -1/+1    0/+1    +1/+1

    return [
        // Above
        cells[x - 1]?.[y - 1],
        cells[x]?.[y - 1],
        cells[x + 1]?.[y - 1],
        // Center
        cells[x - 1]?.[y],
        cells[x + 1]?.[y],
        // Below
        cells[x - 1]?.[y + 1],
        cells[x]?.[y + 1],
        cells[x + 1]?.[y + 1],
    ];
};

const getNextCellState = (state: WritableGrain<boolean>, cellId: [x: number, y: number]) => {
    const neighbors = getCellNeighbors(cellId);
    const alive = neighbors.filter((neighbor) => neighbor?.());

    if (state()) {
        // Rule 1, 2, & 3: A live cell only survives if it has 2 or 3 neighbors.
        // Otherwise, it dies (underpopulation or overpopulation).
        return alive.length === 2 || alive.length === 3;
    }

    // Rule 4: A dead cell only comes to life if it has exactly 3 neighbors.
    // Otherwise, it stays dead.
    return alive.length === 3;
};

const simulationStep = (manual = false) => {
    // Abort if simulation doesn't run
    if (!running() && manual === false) return;

    // Find next cell state

    const nextBatch = cells.map((col, idx) => {
        return col.map((cell, idy) => {
            return getNextCellState(cell, [idx, idy]);
        });
    });

    // Apply rules
    let trackAlive = 0;
    cells.forEach((row, idx) => {
        row.forEach((cell, idy) => {
            cell.set(nextBatch[idx][idy]);
            if (nextBatch[idx][idy]) trackAlive++;
        });
    });
    alive.set(trackAlive);

    generation.update((current) => current + 1);
    window.setTimeout(() => window.requestAnimationFrame(() => simulationStep()), 1000 / gensPerSecond);
};

// Setup and start the simulation.
// Returns a cleanup function that stops any
// further simulation steps
const runSimulation = () => {
    window.requestAnimationFrame(() => simulationStep());

    return () => running.set(false);
};

// Control Actions
const nextSimulationStep = () => {
    running.set(false);
    simulationStep(true);
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
    stopSimulation();
    generation.set(0);
    for (const row of cells) {
        for (const cell of row) {
            cell.set(false);
        }
    }
};

const randomizeCells = () => {
    resetSimulation();
    for (const row of cells) {
        for (const cell of row) {
            cell.set(!!Math.round(Math.random() - 0.25));
        }
    }
};

export const simulationState = {
    actions: { resetSimulation, startSimulation, nextSimulationStep, stopSimulation, randomizeCells },
    parameters: { rows, cols, gensPerSecond },
    state: { cells, running, generation, alive },
};
