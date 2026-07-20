import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const packageRoot = (): string => {
    let dir = dirname(fileURLToPath(import.meta.url));
    while (!existsSync(join(dir, 'package.json'))) {
        const parent = dirname(dir);
        if (parent === dir) {
            throw new Error('Could not locate the @grainular/create-nord package root.');
        }
        dir = parent;
    }
    return dir;
};

export const templatesDir = join(packageRoot(), 'templates');
