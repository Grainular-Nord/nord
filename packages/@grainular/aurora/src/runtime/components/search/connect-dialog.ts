import type { Grain, WritableGrain } from '@grainular/grains';
import { createDirective } from '@grainular/nord';
import type { SearchResult } from '../../features/search/create-search';

type ConnectDialogOptions = {
    dialog: WritableGrain<HTMLDialogElement | null>;
    open: () => void;
    results: Grain<SearchResult[]>;
    active: Grain<number>;
};

/**
 * Connects the search dialog once it is hydrated: stores the node, closes
 * on backdrop clicks, toggles on the global shortcut, and keeps the
 * combobox's active descendant in sync. Escape is handled natively.
 */
export const connectDialog = ({ dialog, open, results, active }: ConnectDialogOptions) =>
    createDirective((node) => {
        const element = node as HTMLDialogElement;
        dialog.set(element);

        const input = element.querySelector<HTMLInputElement>('input');
        const syncActiveDescendant = () => {
            if (results().length > 0) {
                input?.setAttribute('aria-activedescendant', `aurora-search-result-${active()}`);
            } else {
                input?.removeAttribute('aria-activedescendant');
            }
        };
        const backdrop = (event: Event) => event.target === element && element.close();
        const shortcuts = (event: KeyboardEvent) => {
            if (event.key.toLowerCase() !== 'k' || !(event.metaKey || event.ctrlKey) || event.altKey) return;
            event.preventDefault();
            element.open ? element.close() : open();
        };

        element.addEventListener('click', backdrop);
        document.addEventListener('keydown', shortcuts);
        const subscriptions = [results.subscribe(syncActiveDescendant), active.subscribe(syncActiveDescendant)];
        return () => {
            element.removeEventListener('click', backdrop);
            document.removeEventListener('keydown', shortcuts);
            for (const unsubscribe of subscriptions) unsubscribe();
        };
    });
