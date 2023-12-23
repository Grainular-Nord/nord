/** @format */

import { ProcessorProp } from '../../types/processor-prop';
import { getElementAttributeEntries } from '../../utils/get-element-attribute-entries';

/** @todo -> Implement correct substitution per prop. Set up subscriptions and event handlers */
export const øHydrate = (nodes: Document, ...props: ProcessorProp[]) => {
    const tokens = new Set(props.map(({ token }) => token));

    // Create the NodeWalker and set up to show Elements and TextNodes.
    // As TreeWalkers are not able to access attribute nodes, attributes can be safely omitted.
    // To process Attributes, every element needs to be checked manually.
    const tw = document.createTreeWalker(nodes.body, NodeFilter.SHOW_ELEMENT + NodeFilter.SHOW_TEXT, {
        acceptNode: () => {
            return NodeFilter.FILTER_ACCEPT;
        },
    });

    // Iterate the tree walker and process each node
    while (tw.nextNode()) {
        const node = tw.currentNode;

        // check if the element has an attribute that is contained in the tokens set
        if (node instanceof Element) {
            const attributes = getElementAttributeEntries(node);
            if ([...tokens].some((token) => attributes.includes(token))) {
                // get all props that are included as attribute on the node
                props
                    .filter((prop) => attributes.includes(prop.token))
                    // Iterate over the matches and execute the prop processor, passing the node as argument
                    .forEach(({ process, token }) => process(token, node));
            }
        }

        // If the node is a instance of a text node, check if the node value contains a text
        if (node instanceof Text && [...tokens].some((token) => node.nodeValue?.includes(token))) {
            // get all props that are included in the node value of the node
            const processProps = props.filter((prop) => node.nodeValue?.includes(prop.token));
            // Iterate over the matches and execute the prop processor, passing the node as argument
            processProps.forEach(({ process, token }) => process(token, node));
        }
    }
};
