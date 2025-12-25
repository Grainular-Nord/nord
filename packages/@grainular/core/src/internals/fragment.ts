import type { FragmentMap } from '../component/template-parser';

export type Fragment = {
    id: string;
    readonly fragments: FragmentMap;
    resolve: () => string;
    hydrateClient: (node: Node) => void;
};
