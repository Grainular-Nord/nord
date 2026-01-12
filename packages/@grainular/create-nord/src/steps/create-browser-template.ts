import { spinner } from '@clack/prompts';
import { styleText } from 'node:util';
import { templates } from '../lib/templates';
import { writeTemplateFiles } from '../lib/write-template-files';

export const createBrowserTemplate = async ({ path, name }: { path: string; name: string }) => {
    const loader = spinner();
    loader.start();
    loader.message('Creating Nørd for the Browser.');

    // We get all file entries from the respective
    // template, and then pass them to the writer fn
    // which creates the respective files with the
    // context provided.
    const files = templates.get('browser') ?? {};
    const { created, stats } = await writeTemplateFiles(path, { name, type: 'browser' }, files);

    // After success, we can exit the operation
    // this allows the main thread to continue.
    // (We also log some pretty info to not be boring)
    const target = styleText(['bold', 'cyan'], path.replace(process.cwd(), ''));
    const infos = styleText(['dim', 'gray'], `(created ${created} files in ${stats.toFixed(2)}ms)`);
    loader.stop(`Created Nørd Application in ${target} ${infos}`);
};
