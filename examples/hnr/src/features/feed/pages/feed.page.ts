import { derived } from '@grainular/grains';
import { html } from '@grainular/nord';
import { navigate } from '@grainular/router';
import { ListRenderer } from '../../../shared/components/list-renderer.ts';
import { Loader } from '../../../shared/components/loader.ts';
import { PageHeader } from '../../../shared/components/page-header.ts';
import { Pagination } from '../../../shared/components/pagination.ts';
import { FeedItemCard } from '../components/feed-item-card.ts';
import { getFeedLabel } from '../models/feed-type.ts';
import { feedState } from '../stores/feed.store.ts';

const { state, actions } = feedState;
export default () => {
    // On init, check if params are defined, otherwise
    // redirect to the newest feed.
    if (!state.currentFeed()) {
        navigate('/feed/news');
    }

    return html`
        ${PageHeader({
            label: derived(state.currentFeed, getFeedLabel),
            children: Pagination({
                current: state.currentPage,
                onNext: actions.nextPage,
                onPrev: actions.prevPage,
                hasNextPage: state.hasNextPage,
            }),
        })}

        <div class="content"}>
            ${ListRenderer({
                resource: state.resource,
                renderItem: (item, idx) => FeedItemCard({ ...item, rank: idx }),
                renderLoad: () => html`${Loader()}`,
            })}
        </div>
        `;
};
