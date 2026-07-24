import { combined, derived, grain } from '@grainular/grains';
import { $switch, html, on } from '@grainular/nord';
import { createSearch, type SearchResult } from '../../features/search/create-search';
import { Icon } from '../primitives/icon';
import { connectDialog } from './connect-dialog';
import { highlightMatches } from './highlight-matches';
import { SearchPreview } from './search-preview';
import { SearchResults } from './search-results';

type SearchProps = {
    index: string;
    base: string;
};

type SearchState = 'idle' | 'loading' | 'empty' | 'results';

const isApple = () => typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform);

export const Search = ({ index, base }: SearchProps) => {
    const search = createSearch({ index, base });
    const dialog = grain<HTMLDialogElement | null>(null);
    const query = grain('');
    const results = grain<SearchResult[]>([]);
    const active = grain(0);
    const loading = grain(false);
    const activeResult = derived(combined([results, active]), ([items, current]) => items.at(current));
    const state = derived(combined([loading, query, results]), ([pending, value, items]): SearchState => {
        if (pending) return 'loading';
        if (!value.trim()) return 'idle';
        return items.length > 0 ? 'results' : 'empty';
    });

    // The platform never changes while the page lives, so the shortcut
    // label is resolved once instead of through a grain.
    const shortcut = isApple() ? '⌘K' : 'Ctrl K';

    const load = async () => {
        if (search.loaded) return search.load();
        loading.set(true);
        try {
            return await search.load();
        } finally {
            loading.set(false);
        }
    };

    const open = () => {
        const node = dialog();
        if (!node || node.open) return;
        node.showModal();
        void load().catch(() => undefined);
    };

    const navigate = (result: SearchResult) => {
        dialog()?.close();
        window.location.href = search.href(result);
    };

    const update = async (value: string) => {
        query.set(value);
        active.set(0);
        if (!value.trim()) return results.set([]);

        try {
            await load();
            results.set(await search.find(value));
        } catch {
            results.set([]);
        }
    };

    const keyboard = (event: KeyboardEvent) => {
        if (results().length === 0) return;
        if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            event.preventDefault();
            const offset = event.key === 'ArrowDown' ? 1 : -1;
            active.set((active() + offset + results().length) % results().length);
        }
        if (event.key === 'Enter') {
            event.preventDefault();
            const result = results()[active()];
            if (result) navigate(result);
        }
    };

    return html`
        <div class="aurora-search-container">
            <button
                class="aurora-search"
                type="button"
                aria-haspopup="dialog"
                aria-keyshortcuts="Meta+K Control+K"
                ${on('click', open)}
            >
                ${Icon({ name: 'search' })}
                <span class="aurora-search-placeholder">Search docs...</span>
                <kbd>${shortcut}</kbd>
            </button>
            <dialog
                class="aurora-search-dialog"
                aria-label="Search documentation"
                ${connectDialog({ dialog, open, results, active })}
                ${highlightMatches(query, results, active)}
            >
                <label class="aurora-search-field">
                    ${Icon({ name: 'search' })}
                    <input
                        type="search"
                        placeholder="Search docs..."
                        aria-label="Search documentation"
                        role="combobox"
                        aria-autocomplete="list"
                        aria-haspopup="listbox"
                        aria-controls="aurora-search-results"
                        aria-expanded="${derived(state, (value) => value === 'results')}"
                        autocomplete="off"
                        autofocus
                        ${on('input', (event) => void update((event.target as HTMLInputElement).value))}
                        ${on('keydown', keyboard)}
                    />
                    <kbd>esc</kbd>
                </label>
                ${$switch(state)
                    .$case('idle', () => html`<div class="aurora-search-status">Type to search the documentation</div>`)
                    .$case('loading', () => html`<div class="aurora-search-status" role="status">Searching…</div>`)
                    .$case(
                        'empty',
                        () => html`<div class="aurora-search-status" role="status">No results for “${query}”</div>`,
                    )
                    .$default(
                        () => html`
                            <div class="aurora-search-panes">
                                ${SearchResults({
                                    results,
                                    active,
                                    href: search.href,
                                    dismiss: () => dialog()?.close(),
                                })}
                                ${SearchPreview(activeResult)}
                            </div>
                        `,
                    )}
            </dialog>
        </div>
    `;
};

export default Search;
