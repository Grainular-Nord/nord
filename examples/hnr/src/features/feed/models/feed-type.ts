export const feedTypes = ['news', 'newest', 'show', 'ask', 'jobs'] as const;
export type FeedType = (typeof feedTypes)[number];

// Labels
export const feedLabels = new Map<string, string>([
    ['news', 'Top'],
    ['newest', 'New'],
    ['show', 'Show'],
    ['ask', 'Ask'],
    ['jobs', 'Jobs'],
]);

export const getFeedLabel = (type: FeedType | string) => {
    return feedLabels.get(type) ?? '';
};
