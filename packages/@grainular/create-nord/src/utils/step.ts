import { abort } from './abort';

export const step = async <T>(vn: () => Promise<T | symbol>): Promise<T> => {
    const value = await vn();

    if (!abort(value)) {
        throw new Error('Operation was previously aborted');
    }

    return value;
};
