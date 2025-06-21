export type Fragment = {
    id: string;
    resolve: () => string;
    hydrateClient: (node: Node) => void;
};
