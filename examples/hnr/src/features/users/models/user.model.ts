export type User = {
    id: string;
    created: number; // unix timestamp
    karma: number;
    about?: string; // HTML string, like comments
    submitted?: number[]; // array of item ids — can be huge
};
