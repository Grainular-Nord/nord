import { derived, type Grain, type WritableGrain } from '@grainular/grains';
import { $each, $if, html, on } from '@grainular/nord';
import type { SearchResult } from '../../features/search/create-search';

type SearchResultsProps = {
    results: Grain<SearchResult[]>;
    active: WritableGrain<number>;
    href: (result: SearchResult) => string;
    dismiss: () => void;
};

export const SearchResults = ({ results, active, href, dismiss }: SearchResultsProps) => html`
    <div id="aurora-search-results" class="aurora-search-results" role="listbox" aria-label="Search results">
        ${$each(results)
            .$withKey((result) => `${result.path}${result.anchor}`)
            .$as((result, position) => {
                const selected = derived(active, (value) => value === position());
                return html`
                    <a
                        id="aurora-search-result-${position}"
                        class="aurora-search-result"
                        href="${href(result)}"
                        role="option"
                        tabindex="-1"
                        aria-selected="${selected}"
                        ${on('pointerenter', () => active.set(position()))}
                        ${on('click', dismiss)}
                    >
                        <span class="aurora-search-result-title">${result.title}</span>
                        ${$if(() => Boolean(result.section)).$then(
                            () => html`<span class="aurora-search-result-section">${result.section}</span>`,
                        )}
                        <span class="aurora-search-result-excerpt">${result.excerpt}</span>
                    </a>
                `;
            })}
    </div>
`;
