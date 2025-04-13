import type { Fragment } from '../component/fragment';
import { trackAttributeNode } from '../internals/track-attribute-node';

export const hydrateClient = (root: ParentNode, fragments: Map<string, Fragment>) => {
    const fragmentKeys = [...fragments.keys()];

    // We create our filter and tree walker, that we can then
    // use to iterate the created DOM tree. We also create a new
    // Set to hold the resolver fns. We want to execute those runs
    // after the whole tree is parsed, to prevent manipulation of the
    // dom that could break our tree walker.
    const filter = NodeFilter.SHOW_ELEMENT + NodeFilter.SHOW_COMMENT;
    const tw = document.createTreeWalker(root, filter, { acceptNode: () => NodeFilter.FILTER_ACCEPT });
    const hydrationNodes = new Set<() => void>();

    // We can then iterate the tree walker nodes
    // and operate on them
    while (tw.nextNode()) {
        const node = tw.currentNode;

        // If the node is a comment, we can simply look up the created
        // id and if the fragments map as a corresponding entry, push
        // a resolver that runs the fragment's hydration method with
        // the respective node. This works as even if there is a
        // comment node that contains a :, we still don't have a
        // corresponding id, so there will be no action taken.
        if (node instanceof Comment && node.textContent) {
            const [_, key] = node.textContent.split(':');
            if (fragments.has(key)) {
                hydrationNodes.add(() => fragments.get(key)?.hydrateClient(node));
            }
        }

        // Elements are harder to process, as there are multiple
        // cases that need to be differentiated and processed.
        // Basically, we want to check for attributes that have
        // a corresponding entry in our fragment map, as well as
        // check and parse all attribute values, to find any
        // grain that has been inserted in one.
        if (node instanceof HTMLElement) {
            const keys = new Set(node.getAttributeNames());
            const intersected = keys.intersection(new Set(fragments.keys()));
            if (intersected.size) {
                for (const key of intersected) {
                    hydrationNodes.add(() => fragments.get(key)?.hydrateClient(node));
                }
            }

            for (const key of keys) {
                const value = node.getAttribute(key);
                const fragmentEntries = fragmentKeys.flatMap((key) =>
                    // biome-ignore lint/style/noNonNullAssertion: We have asserted this key exists in the map.
                    value?.includes(key) ? [fragments.get(key)!] : [],
                );
                // If we find such keys, we want to set up a attr observer on the node and
                // attribute, that tracks all the values correctly.
                if (fragmentEntries.length) {
                    trackAttributeNode(node, key, fragmentEntries);
                }
            }
        }
    }

    for (const node of hydrationNodes) node();
};
