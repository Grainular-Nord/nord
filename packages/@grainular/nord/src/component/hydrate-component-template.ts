import { createAttributeBinding } from '../internals/attribute-bindings';
import type { Fragment } from '../internals/fragment';
import { identifierRegex } from '../internals/identifier';
import { iterateNodes } from '../internals/iterate-nodes';

// To not create a unnecessary closure,
// we simply store the fragment with it's
// respective arguments for hydration
// We can then simply call fragment.hydrate(...args)
type HydrationWorkUnit = { fragment: Fragment; args: Parameters<Fragment['hydrate']> };

/**
 * Fn to hydrate a provided node and it's children (until the next component boundary)
 * using the provided `fragments` array. As we place the fragments sequentially, we
 * can safely access them by the encoded index. This allows to safe on map creation
 * and keying overhead.
 *
 * The previous implementation used a TreeWalker, however benchmarking showed
 * that iterating manually is actually faster then the native implementation.
 */
export const hydrateComponentTemplate = (node: Node, fragments: Fragment[], scope?: string) => {
    const hydrationUnits: HydrationWorkUnit[] = [];
    iterateNodes(node, (current) => {
        // Comments are handled by finding the
        // correct fragment and simply placing a
        // hydration order.
        if (current instanceof Comment) {
            const content = current.data;

            if (content.startsWith('nø-')) {
                const id = content.slice(3); // Remove 'nø-'
                const idx = Number.parseInt(id, 10);
                const fragment = fragments[idx];

                if (fragment) {
                    hydrationUnits.push({ fragment, args: [current as Comment] });
                }
            }
        }

        // --- 2. Element Nodes ---
        if (current instanceof Element) {
            //
            const attrs = [...current.attributes];
            for (const { name, value } of attrs) {
                // If the name starts with nø- we have a directive
                // can process it and then continue directly
                if (name.startsWith('nø-')) {
                    const idx = Number.parseInt(name.slice(3), 10);
                    const fragment = fragments[idx];

                    if (fragment) {
                        hydrationUnits.push({ fragment, args: [current] });
                        current.removeAttribute(name);
                    }

                    continue;
                }

                // If the value doesn't include a marker, we skip processing
                // it entirely, which should make this faster
                if (!value.includes('nø-')) continue;
                const matches = value.split(identifierRegex);
                for (const match of matches) {
                    if (match.startsWith('nø-')) {
                        const idx = Number.parseInt(match.slice(3), 10);
                        const fragment = fragments[idx];

                        if (fragment) {
                            const binding = createAttributeBinding(current, name, match, matches);
                            hydrationUnits.push({ fragment, args: [current, { binding }] });
                        }
                    }
                }
            }

            // Apply Scope
            if (scope) {
                current.setAttribute(scope, '');
            }
        }
    });
    return hydrationUnits;
};
