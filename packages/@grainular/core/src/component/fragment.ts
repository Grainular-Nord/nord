export type Fragment = {
    id: string;
    resolve: () => string;
    hydrateClient: (node: Node) => void;
    hydrateServer: (html: string) => void;
};
