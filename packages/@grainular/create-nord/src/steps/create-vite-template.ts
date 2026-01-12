import { cancel, confirm, log, spinner } from '@clack/prompts';
import { spawn } from 'node:child_process';
import { styleText } from 'node:util';
import { type TemplateContext, templates } from '../lib/templates';
import { writeTemplateFiles } from '../lib/write-template-files';
import { step } from '../utils/step';

const getPkgManager = (): string => {
    const agent = process.env.npm_config_user_agent;
    if (!agent) return 'npm';

    const [name] = agent.split('/');
    return name ?? 'npm';
};

const installDependencies = async (cwd: string, manager: string): Promise<void> => {
    // Note: We do not use a spinner here because stdio: 'inherit' allows the
    // package manager to show its own interactive progress bar.
    // A separate spinner would conflict with that output.
    log.step(`Installing dependencies via ${manager}...`);

    return new Promise((resolve, reject) => {
        const subprocess = spawn(manager, ['install'], { cwd, stdio: 'inherit', shell: true });

        subprocess.on('close', (code) => {
            if (code === 0) return resolve();
            reject(new Error(`${manager} install exited with code ${code}`));
        });
    });
};

const runDev = async (cwd: string, manager: string): Promise<void> => {
    log.step(`Starting dev server via ${manager}...`);

    return new Promise((resolve, reject) => {
        const subprocess = spawn(manager, ['run', 'dev'], { cwd, stdio: 'inherit', shell: true });

        subprocess.on('close', (code) => {
            if (code === 0) return resolve();
            // It's common for dev servers to be killed with SIGINT (null code) or 0
            // but if it crashes, we reject.
            reject(new Error(`${manager} run dev exited with code ${code}`));
        });
    });
};

export const createViteTemplate = async (
    type: 'vite' | 'vite-ts',
    { path, name, ...context }: TemplateContext & { path: string },
) => {
    const loader = spinner();
    loader.start();
    loader.message('Creating Nørd for Vite.');

    const files = templates.get(type) ?? {};
    const { created, stats } = await writeTemplateFiles(path, { name, ...context }, files);

    const target = styleText(['bold', 'cyan'], path.replace(process.cwd(), ''));
    const infos = styleText(['dim', 'gray'], `(created ${created} files in ${stats.toFixed(2)}ms)`);
    loader.stop(`Created Nørd Vite Application in ${target} ${infos}`);

    // Infer package manager
    const pkgManager = getPkgManager();
    const install = await step(() =>
        confirm({
            message: `Install dependencies and run with ${pkgManager}?`,
        }),
    );

    try {
        if (install) {
            await installDependencies(path, pkgManager);
            await runDev(path, pkgManager);
        }
    } catch (e: unknown) {
        if (e instanceof Error) {
            log.error(e.message);
        } else {
            log.error('An unknown error occurred.');
        }
        cancel('Operation cancelled due to an error.');
        process.exit(1);
    }
};
