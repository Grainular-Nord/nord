import { rm } from 'node:fs/promises';
import { styleText } from 'node:util';
import { spinner } from '@clack/prompts';
import { scaffoldBrowserTemplate } from '../lib/scaffold';

export const createBrowserTemplate = async ({ path, name }: { path: string; name: string }) => {
    const loader = spinner();
    loader.start();
    loader.message('Creating Nørd for the Browser.');

    // We copy the browser template's files into the
    // target directory, adapted with the project's name.
    const started = performance.now();
    let created = 0;
    try {
        ({ created } = await scaffoldBrowserTemplate(path, { name }));
    } catch (error) {
        await rm(path, { recursive: true, force: true });
        console.error(error);
        process.exit(1);
    }

    // After success, we can exit the operation
    // this allows the main thread to continue.
    // (We also log some pretty info to not be boring)
    const target = styleText(['bold', 'cyan'], path.replace(process.cwd(), ''));
    const infos = styleText(
        ['dim', 'gray'],
        `(created ${created} files in ${(performance.now() - started).toFixed(2)}ms)`,
    );
    loader.stop(`Created Nørd Application in ${target} ${infos}`);
};
