import { exists, mkdir, rm, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import type { TemplateContext, TemplateCreatorFn } from './templates';

export const writeTemplateFiles = async (
    root: string,
    ctx: Partial<TemplateContext> & { name: string; type: string },
    files: Record<string, TemplateCreatorFn>,
) => {
    let created = 0;
    const started = performance.now();

    if (!(await exists(root))) {
        await mkdir(root, { recursive: true });
    }

    try {
        for (const [key, creator] of Object.entries(files)) {
            const filename = join(root, key);
            const directory = dirname(filename);

            const content = await creator({ additionalDependencies: [], useRolldown: false, ...ctx });

            // If nothing is supposed to be created,
            // we continue the loop
            if (content.length === 0) {
                continue;
            }

            // Otherwise, we make sure the directory exists
            // and then write the file.
            if (!(await exists(directory))) {
                await mkdir(directory);
            }

            created++;
            await writeFile(filename, content.join('\n'), {
                encoding: 'utf-8',
            });
        }
    } catch (error) {
        await rm(root, { recursive: true, force: true });
        console.error(error);
        process.exit(1);
    }

    return { created, stats: performance.now() - started };
};
