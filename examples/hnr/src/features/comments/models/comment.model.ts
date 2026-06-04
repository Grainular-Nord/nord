export type Comment = {
    id: number;
    user: string;
    time_ago: string;
    content: string;
    comments: Comment[];
    level: number;
};
