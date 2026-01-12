import { cancel, confirm, text } from '@clack/prompts';
import { exists } from 'node:fs/promises';
import { basename } from 'node:path';
import { styleText } from 'node:util';
import { isValidPackageName } from '../utils/is-valid-package-name';
import { root } from '../utils/root';
import { step } from '../utils/step';

export const projectDetails = async () => {
    // Require a project name to place the
    // application in.
    const projectName = await step(() =>
        text({
            message: 'Select a directory to place your application.',
            placeholder: './',
            defaultValue: './',
            validate(value) {
                if (value.length === 0) return 'Please select a directory for your application';
                return;
            },
        }),
    );

    // We then convert the path to absolute and
    // check if it already exist, to know if we
    // should prompt to clear:
    const path = root(projectName);
    if (await exists(path)) {
        const clear = await step(() =>
            confirm({
                message: styleText(['redBright'], 'Chosen directory is not empty. Continue anyway?'),
            }),
        );

        // If the user does not want to continue,
        // we indicate and abort the operation
        if (!clear) {
            cancel(`${styleText(['bold'], projectName)} already exists, aborting.`);
            process.exit(0);
        }
    }

    // We then check if the name is valid, and if not,
    // prompt the user to enter a valid package name
    let name = basename(path);
    if (!isValidPackageName(name)) {
        name = await step(() =>
            text({
                message: "What's the name of your application?",
                validate: (value) => {
                    if (!isValidPackageName(value)) {
                        return 'Please use a valid npm package name';
                    }
                },
            }),
        );
    }

    return { path, name };
};
