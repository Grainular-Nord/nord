import { combined, derived } from '@grainular/grains';
import { $each, $if, type ComponentFragment, html } from '@grainular/nord';
import type { resource } from '@grainular/resource';

export type ListRendererProps<T extends { id: number }> = {
    resource: ReturnType<typeof resource<T[]>>;
    renderItem: (item: T, idx: number) => ComponentFragment;
    renderLoad: () => ComponentFragment;
};
export const ListRenderer = <T extends { id: number }>(props: ListRendererProps<T>) => {
    const { resource, renderItem, renderLoad } = props;
    const rows = derived(resource.data, (data) => data ?? []);
    const isLoading = derived(
        combined([resource.state, resource.data]),
        ([state, data]) => state === 'pending' || data?.length === 0,
    );

    return html`
       ${$if(isLoading)
           .$then(() => renderLoad())
           .$else(() => html`${$each(rows).$as(renderItem)}`)}`;
};
