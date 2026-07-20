import { derived, type Grain } from '@grainular/grains';
import { $render, html } from '@grainular/nord';
import type { SearchResult } from '../../features/search/create-search';

export const SearchPreview = (result: Grain<SearchResult | undefined>) =>
    $render(
        derived(result, (current) => {
            if (!current) return html`<div class="aurora-search-preview"></div>`;

            return html`
                <div class="aurora-search-preview">
                    ${
                        current.section
                            ? html`<span class="aurora-search-preview-section">${current.section}</span>`
                            : null
                    }
                    <h2 class="aurora-search-preview-title">${current.title}</h2>
                    <p class="aurora-search-preview-text">${current.text}</p>
                </div>
            `;
        }),
    );
