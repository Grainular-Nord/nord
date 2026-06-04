import { derived, grain, readonly } from '@grainular/grains';
import { resource } from '@grainular/resource';
import { navigate } from '@grainular/router';
import { params } from '../../../router';
import type { FeedItem } from '../models/feed-item';

const isFeedItem = (data: unknown): data is FeedItem => {
    return data !== null && typeof data === 'object' && 'id' in data;
};

const pagination = grain(1);
const nextPage = () => pagination.set(pagination() + 1);
const prevPage = () => pagination.set(Math.max(1, pagination() - 1));
const setPage = (target: number) => pagination.set(Math.max(1, target));

// Feed is controlled by the router, not the state.
// we really just read the state and fetch the resources accordingly
// as a sideeffect of type change, we reset the pagination
const feed = params.select<'feed'>((params) => params.feed);
feed.subscribe(() => pagination.set(1));

const feedResource = resource(
    async ({ abortSignal }) => {
        if (!feed()) return [];

        const response = await fetch(`https://node-hnapi.herokuapp.com/${feed()}?page=${pagination()}`, {
            signal: abortSignal,
        });

        if (!response.ok) {
            navigate(`/error/${response.status}`);
            return [];
        }

        const data = await response.json();

        // In lieu of using a validator library, we just
        // assume that everything is fine here. (lol)
        return [data].flat().filter((item) => isFeedItem(item));
    },
    [pagination, feed],
);

const hasNextPage = derived(feedResource.data, (data) => (data ?? []).length === 30);
export const feedState = {
    actions: {
        nextPage,
        prevPage,
        setPage,
    },
    state: {
        currentPage: readonly(pagination),
        hasNextPage: hasNextPage,
        currentFeed: feed,
        resource: feedResource,
    },
};
