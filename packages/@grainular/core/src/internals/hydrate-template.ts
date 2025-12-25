import { hydrateClient } from '../application/hydrate-client';
import type { TemplateResult } from '../component/template-parser';

export const hydrateTemplate = (template: TemplateResult) => {
    if (!template) return [] as Element[];

    const fragment = document.createElement('template');
    fragment.innerHTML = template.resolve().trim();

    // Merge adjacent text nodes (Standard normalization)
    fragment.content.normalize();
    hydrateClient(fragment.content, template.fragments);

    // Now strict Array.from will return the elements/comments you actually expect
    return Array.from(fragment.content.childNodes) as Element[];
};
