export type FeedItem = {
    id: number;
    title: string;
    points: number | null;
    user: string | null;
    time_ago: string; // "2 hours ago" — pre-formatted
    comments_count: number;
    type: string; // "link" | "ask" | "job"
    url?: string;
    domain?: string;
};
