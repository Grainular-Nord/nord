import { cancel, isCancel } from '@clack/prompts';

export const abort = <T>(value: T | symbol): value is T => {
    if (isCancel(value)) {
        cancel('Operation cancelled.');
        process.exit(0);
    }

    return true;
};
