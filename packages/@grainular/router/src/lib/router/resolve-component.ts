import { type ComponentFragment, html } from '@grainular/nord';
import type { Route } from '../../types/route';

export const resolveComponent = async (component: Route['component']): Promise<ComponentFragment> => {
    if (!component) return html``;
    const resolved = await component();
    return 'default' in resolved ? resolved.default : resolved;
};
