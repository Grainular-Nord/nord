import { createAttributeBinding } from '../internals/attribute-bindings';
import type { Fragment } from '../internals/fragment';
import { identifierRegex } from '../internals/identifier';

/**
 * Fn to hydrate a provided node and it's children (until the next component boundary)
 * using the provided `fragments` array. As we place the fragments sequentially, we
 * can safely access them by the encoded index. This allows to safe on map creation
 * and keying overhead.
 */
export const hydrateComponentTemplate = (node: Node, fragments: Fragment[], scope?: string) => {
    // 1. Create TreeWalker (Fastest DOM traversal)
    const tw = document.createTreeWalker(node, NodeFilter.SHOW_COMMENT + NodeFilter.SHOW_ELEMENT);
    const hydrationNodes: (() => void)[] = [];

    while (tw.nextNode()) {
        const currentNode = tw.currentNode;

        // Comment nodes only contain standard hydration markers
        if (currentNode instanceof Comment && currentNode.textContent) {
            const key = currentNode.textContent.slice(1, -1);

            // If the extracted key starts with our
            // internally provided 'nø-' identifier, we
            // can assume that it is a framework key.
            // This doesn't really help if a developer starts
            // prefixing it's comments with it, but that's
            // ultimately their problem
            if (key.startsWith('nø-')) {
                const idx = Number.parseInt(key.slice(3), 10);
                const fragment = fragments[idx];
                if (fragment && fragment.id() === key) {
                    hydrationNodes.push(() => fragment.hydrate(currentNode));
                }
            }
            continue;
        }

        // Elements are more complex in their respective fragment handling
        // and can contain standard fragment keys as well as short keys (for directives)
        if (currentNode instanceof Element) {
            for (const { name, value } of currentNode.attributes) {
                // Handling directly attached directives (on the node, as attribute)
                if (name.startsWith('nø-')) {
                    const idx = Number.parseInt(name.slice(3), 10);
                    const fragment = fragments[idx];

                    if (fragment && fragment.id() === name) {
                        hydrationNodes.push(() => {
                            fragment.hydrate(currentNode);
                            currentNode.removeAttribute(name);
                        });
                    }
                }

                // Handling standard fragments inside attribute strings
                if (value.includes('nø-')) {
                    const matches = value.split(identifierRegex);

                    for (const match of matches) {
                        if (match.startsWith('nø-')) {
                            const idx = Number.parseInt(match.slice(3), 10);
                            const fragment = fragments[idx];

                            if (fragment && fragment.id() === match) {
                                // To cleanly track the updating without relying on any kind
                                // of fragment id, we explitily create a binding via closure.
                                // This has the disadvantage of needing to pass to the hydrate
                                // method, but is better then alternatives
                                const binding = createAttributeBinding(currentNode, name, match, matches);
                                hydrationNodes.push(() => {
                                    fragment.hydrate(currentNode, { binding });
                                });
                            }
                        }
                    }
                }
            }

            // If we need to set a scope (through styling)
            // we push a standard operation (no modification of dom
            // during walk)
            if (scope) hydrationNodes.push(() => currentNode.setAttribute(scope, ''));
        }
    }

    return hydrationNodes;
};
