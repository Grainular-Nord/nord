import { hydrateClient } from '../application/hydrate-client';
import { isComponent } from '../component/component-fragment';
import { type TemplateResult, fragmentMap } from '../component/template-parser';

export const memoizeNodes = (template: TemplateResult) => {
    if (!template) return [] as Element[];

    const fragment = document.createElement('template');
    fragment.innerHTML = isComponent(template) ? template.resolve() : template;
    hydrateClient(fragment, fragmentMap);

    return Array.from(fragment.content.childNodes) as Element[];
};
