declare module '*.md' {
    export const meta: { title?: string } & Record<string, unknown>;
    export const content: string;
}
