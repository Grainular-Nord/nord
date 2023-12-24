/** @format */

import { ProcessorProp } from '../../types/processor-prop';
import { getElementAttributeEntries } from '../../utils/get-element-attribute-entries';
import { toPascalCase } from '../../utils/to-pascal-case';

/** @todo -> Implement correct substitution per prop. Set up subscriptions and event handlers */
export const øHydrate = (nodes: Document, ...props: ProcessorProp[]) => {
    const tokens = new Set(props.map(({ token }) => token));
    const processInstructions: (ProcessorProp & { node: Element | Text })[] = [];
    const childInstruction: { node: Element }[] = [];

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

        // mark possible nested components
        if (node instanceof Element && window.$$nord.components.has(toPascalCase`${node.tagName}`)) {
            childInstruction.push({ node });
        }

        if (node instanceof Element) {
            // check if the element has an attribute that is contained in the tokens set
            const attributes = getElementAttributeEntries(node);
            if ([...tokens].some((token) => attributes.includes(token))) {
                // get all props that are included as attribute on the node
                props
                    .filter((prop) => attributes.includes(prop.token))
                    // Iterate over the matches and execute the prop processor, passing the node as argument
                    .forEach(({ process, token }) => processInstructions.push({ node, token, process }));
            }
        }

        // If the node is a instance of a text node, check if the node value contains a text
        if (node instanceof Text && [...tokens].some((token) => node.nodeValue?.includes(token))) {
            // get all props that are included in the node value of the node
            const processProps = props.filter((prop) => node.nodeValue?.includes(prop.token));
            // Iterate over the matches and execute the prop processor, passing the node as argument
            processProps.forEach(({ process, token }) => processInstructions.push({ node, token, process }));
        }
    }

    // After the tree walker completes, process the found tokens
    while (processInstructions.length) {
        const instruction = processInstructions.shift();
        if (instruction) {
            const { process, token, node } = instruction;
            process(token, node);
        }
    }

    // check all remaining children for having been processed, if not process them here
    while (childInstruction.length) {
        const instruction = childInstruction.shift();
        if (instruction) {
            const { node } = instruction;
            const component = window.$$nord.components.get(toPascalCase`${node.tagName}`);
            if (node.isConnected && component) {
                node.replaceWith(...component({}, node.childNodes));
            }
        }
    }
};
