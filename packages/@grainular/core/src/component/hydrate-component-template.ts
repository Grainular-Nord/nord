import { createAttributeBinding } from '../internals/attribute-bindings';
import type { Fragment } from '../internals/fragment';
import { identifierRegex } from '../internals/identifier';

export const hydrateComponentTemplate = (node: Node, fragments: Map<string, Fragment>) => {
    const tw = document.createTreeWalker(node, NodeFilter.SHOW_COMMENT + NodeFilter.SHOW_ELEMENT);
    const hydrationNodes = [];

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
                hydrationNodes.push(() => {
                    fragments.get(key)?.hydrate(node);
                    fragments.delete(key);
                });
            }

            continue;
        }

        if (node instanceof Element) {
            const attributes = node.attributes;

            for (const { name, value } of attributes) {
                // Check for existing directives
                // And attach them accordingly
                if (fragments.has(name)) {
                    // biome-ignore lint: We have asserted the fragment exists
                    const fragment = fragments.get(name)!;
                    hydrationNodes.push(() => {
                        fragment.hydrate(node);
                        fragments.delete(name);
                    });
                }

                // We need to check if the value contains one or more
                // fragment ids. If so, we need to attach a attribute
                // observer to that node, that can be updated via
                // the fragment id.
                const attributeMatches = value.split(identifierRegex);
                for (const match of attributeMatches) {
                    const fragment = fragments.get(match);
                    if (!fragment) continue;
                    createAttributeBinding(node, name, fragment.id, attributeMatches);
                    hydrationNodes.push(() => {
                        fragment.hydrate(node);
                        fragments.delete(name);
                    });
                }
            }
        }
    }

    return hydrationNodes;
};
