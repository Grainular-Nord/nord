import { grain } from '@grainular/grains';
import { beforeEach, describe, expect, it } from 'bun:test';
import { resource } from '.';

const flush = (ms = 100) => new Promise<void>((res) => setTimeout(res, ms));

describe('resource', () => {
    let abortCount = 0;

    const createFetcher =
        <T>(result: T, delay = 0) =>
        async ({ abortSignal }: { abortSignal: AbortSignal }) => {
            return new Promise<T>((resolve, reject) => {
                const id = setTimeout(() => resolve(result), delay);

                abortSignal.addEventListener('abort', () => {
                    abortCount++;
                    clearTimeout(id);
                    reject(new DOMException('Aborted', 'AbortError'));
                });
            });
        };

    beforeEach(() => {
        abortCount = 0;
    });

    it('starts in pending state and resolves to idle with data', async () => {
        // Creates the resource. This should immediately run
        // the async function and set the state to pending
        const res = resource(createFetcher('ok'));
        expect(res.pending()).toBe(true);
        expect(res.state()).toBe('pending');

        // Give the operation some time to finish
        await flush(100);

        // The resource should now be idle again
        expect(res.state()).toBe('idle');
        expect(res.data()).toBe('ok');
        expect(res.error()).toBe(null);
    });

    it('sets error state when fetcher rejects', async () => {
        const res = resource(async () => {
            throw new Error('fail');
        });

        await flush(100);

        expect(res.state()).toBe('error');
        expect(res.error()?.message).toBe('fail');
    });

    it('aborts an in-flight request when refreshed', async () => {
        const res = resource(createFetcher('ok', 50));

        res.refresh();
        res.refresh();

        await flush(100);

        expect(abortCount).toBeGreaterThan(0);
    });

    it('aborts an in-flight request when abort() is called', async () => {
        const res = resource(createFetcher('ok', 50));

        res.abort();
        await flush(100);

        expect(abortCount).toBe(1);
    });

    it('mutate updates data without changing state', async () => {
        const res = resource(createFetcher('initial'));

        await flush(100);
        expect(res.data()).toBe('initial');

        res.mutate('next');

        expect(res.data()).toBe('next');
        expect(res.state()).toBe('idle');
    });

    it('refresh is triggered when a dependency grain changes', async () => {
        const dep = grain(0);
        let calls = 0;

        const res = resource(async () => {
            calls++;
            return calls;
        }, [dep]);

        await flush(100);
        expect(res.data()).toBe(1);

        dep.set(1);
        await flush(100);

        expect(res.data()).toBe(2);
    });

    it('destroy unsubscribes dependencies and aborts requests', async () => {
        const dep = grain(0);
        const res = resource(createFetcher('ok', 50), [dep]);

        res.destroy();

        dep.set(1);
        await flush(100);

        expect(abortCount).toBe(1);
    });

    it('derived grains reflect state correctly', async () => {
        const res = resource(createFetcher('ok'));

        expect(res.pending()).toBe(true);
        await flush(100);

        expect(res.idle()).toBe(true);
        expect(res.pending()).toBe(false);
    });

    it('does not refresh twice on creation when dependencies are provided', async () => {
        const dep = grain(0);
        let calls = 0;
        const res = resource(async () => {
            calls++;
            return calls;
        }, [dep]);

        await flush(100);
        expect(calls).toBe(1);
        expect(res.data()).toBe(1);
    });

    it('refreshes exactly once when a dependency changes', async () => {
        const dep = grain(0);
        let calls = 0;
        const res = resource(async () => {
            calls++;
            return calls;
        }, [dep]);

        await flush(100);
        dep.set(1);
        await flush(100);
        expect(calls).toBe(2);
        expect(res.data()).toBe(2);
    });
});
