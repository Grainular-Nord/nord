import type { ProjectFile } from './types';

type Completion = { detail: string; label: string; type: string };
type QuickInfo = { end: number; start: number; text: string };
type Response = { id: number; result: Completion[] | QuickInfo | undefined };

export const createTypeScriptService = () => {
    const worker = new Worker(new URL('./typescript.worker.ts', import.meta.url), { type: 'module' });
    const requests = new Map<number, (result: Completion[] | QuickInfo | undefined) => void>();
    let nextId = 0;

    worker.onmessage = ({ data }: MessageEvent<Response>) => {
        const resolve = requests.get(data.id);
        if (!resolve) return;
        requests.delete(data.id);
        resolve(data.result);
    };

    worker.onerror = () => {
        for (const resolve of requests.values()) resolve(undefined);
        requests.clear();
    };

    const request = <Result extends Completion[] | QuickInfo>(
        type: 'completions' | 'quick-info',
        path: string,
        position: number,
    ) =>
        new Promise<Result | undefined>((resolve) => {
            const id = ++nextId;
            requests.set(id, (result) => resolve(result as Result | undefined));
            worker.postMessage({ id, path, position, type });
        });

    return {
        completions: (path: string, position: number) => request<Completion[]>('completions', path, position),
        destroy: () => {
            for (const resolve of requests.values()) resolve(undefined);
            requests.clear();
            worker.terminate();
        },
        quickInfo: (path: string, position: number) => request<QuickInfo>('quick-info', path, position),
        sync: (files: ProjectFile[]) => worker.postMessage({ files, type: 'sync' }),
    };
};

export type TypeScriptService = ReturnType<typeof createTypeScriptService>;
