import { derived, grain } from '@grainular/grains';
import { $each, $if, html, mounted, on } from '@grainular/nord';
import { createSearch, type SearchResult } from '../../features/search/create-search';
import { Icon } from '../primitives/icon';

type SearchProps = {
    index: string;
    base: string;
};

export const Search = ({ index, base }: SearchProps) => {
    const search = createSearch({ index, base });
    const query = grain('');
    const results = grain<SearchResult[]>([]);
    const open = grain(false);
    const active = grain(0);
    const loading = grain(false);
    const hasResults = derived(results, (items) => items.length > 0);

    const load = async () => {
        if (search.loaded) return search.load();
        loading.set(true);
        try {
            return await search.load();
        } finally {
            loading.set(false);
        }
    };

    const update = async (value: string) => {
        query.set(value);
        active.set(0);
        if (!value.trim()) {
            results.set([]);
            open.set(false);
            return;
        }

        open.set(true);
        try {
            await load();
            results.set(await search.find(value));
        } catch {
            results.set([]);
        }
    };

    const keyboard = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
            open.set(false);
            return;
        }
        if (!open() || results().length === 0) return;
        if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            event.preventDefault();
            const offset = event.key === 'ArrowDown' ? 1 : -1;
            active.set((active() + offset + results().length) % results().length);
        }
        if (event.key === 'Enter') {
            event.preventDefault();
            const result = results()[active()];
            if (result) window.location.href = search.href(result);
        }
    };

    const lifecycle = mounted((node) => {
        const input = node.querySelector<HTMLInputElement>('input');
        const syncActiveDescendant = () => {
            if (open() && results().length > 0) {
                input?.setAttribute('aria-activedescendant', `aurora-search-result-${active()}`);
            } else {
                input?.removeAttribute('aria-activedescendant');
            }
        };
        const shortcut = (event: KeyboardEvent) => {
            if (event.key !== '/' || event.metaKey || event.ctrlKey || event.altKey) return;
            const target = event.target as HTMLElement | null;
            if (target?.matches('input, textarea, select, [contenteditable="true"]')) return;
            event.preventDefault();
            input?.focus();
        };
        const outside = (event: PointerEvent) => {
            if (!node.contains(event.target as Node)) open.set(false);
        };

        document.addEventListener('keydown', shortcut);
        document.addEventListener('pointerdown', outside);
        const subscriptions = [
            open.subscribe(syncActiveDescendant),
            results.subscribe(syncActiveDescendant),
            active.subscribe(syncActiveDescendant),
        ];
        return () => {
            document.removeEventListener('keydown', shortcut);
            document.removeEventListener('pointerdown', outside);
            for (const unsubscribe of subscriptions) unsubscribe();
        };
    });

    const resultList = $each(results)
        .$withKey((result) => `${result.path}${result.anchor}`)
        .$as((result, index) => {
            const selected = derived(active, (value) => value === index());
            return html`
                <a
                    id="aurora-search-result-${index}"
                    class="aurora-search-result"
                    href="${search.href(result)}"
                    role="option"
                    tabindex="-1"
                    aria-selected="${selected}"
                    ${on('pointerenter', () => active.set(index()))}
                    ${on('click', () => open.set(false))}
                >
                    <span class="aurora-search-result-title">${result.title}</span>
                    ${$if(() => Boolean(result.section)).$then(
                        () => html`<span class="aurora-search-result-section">${result.section}</span>`,
                    )}
                    <span class="aurora-search-result-excerpt">${result.excerpt}</span>
                </a>
            `;
        });

    const resultContent = $if(loading)
        .$then(() => html`<div class="aurora-search-status" role="status">Searching…</div>`)
        .$else(
            () =>
                html`${$if(hasResults)
                    .$then(() => html`${resultList}`)
                    .$else(
                        () => html`<div class="aurora-search-status" role="status">No results for “${query}”</div>`,
                    )}`,
        );

    return html`
        <div class="aurora-search-container" ${lifecycle}>
            <label class="aurora-search">
                ${Icon({ name: 'search' })}
                <input
                    type="search"
                    placeholder="Search docs..."
                    aria-label="Search documentation"
                    role="combobox"
                    aria-autocomplete="list"
                    aria-haspopup="listbox"
                    aria-controls="aurora-search-results"
                    aria-expanded="${open}"
                    autocomplete="off"
                    ${on('focus', () => {
                        if (query()) open.set(true);
                        void load().catch(() => undefined);
                    })}
                    ${on('input', (event) => void update((event.target as HTMLInputElement).value))}
                    ${on('keydown', keyboard)}
                />
                <kbd>/</kbd>
            </label>
            ${$if(open).$then(
                () => html`
                    <div
                        id="aurora-search-results"
                        class="aurora-search-results"
                        role="listbox"
                        aria-label="Search results"
                    >
                        ${resultContent}
                    </div>
                `,
            )}
        </div>
    `;
};

export default Search;
