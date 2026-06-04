import type { Comment } from '../../comments/models/comment.model';

export type Story = {
    id: number;
    title: string;
    points: number | null;
    user: string | null;
    time_ago: string;
    url?: string;
    domain?: string;
    content?: string; // for Ask HN / text posts
    comments_count: number;
    comments: Comment[];
    type: string;
};
