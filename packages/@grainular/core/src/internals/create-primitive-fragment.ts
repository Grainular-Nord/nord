import type { Fragment } from '../component/fragment';
import { identifier } from './identifier';
import type { AttributeControlledNode } from './track-attribute-node';

export const createPrimitiveFragment = (data: string | number | boolean): Fragment => {
    const id = identifier();
    return {
        id,
        resolve: () => `<!--:${id}:-->`,
        hydrateClient: (node: Node) => {
            if (node instanceof Comment) {
                node.replaceWith(new Text(`${data}`));
            }
            if (
                ((node: Node): node is AttributeControlledNode =>
                    node instanceof HTMLElement && 'updateAttribute' in node)(node)
            ) {
                node.updateAttribute(id, data);
            }
        },
        hydrateServer: () => {},
    };
};
