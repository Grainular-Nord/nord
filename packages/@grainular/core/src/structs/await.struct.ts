import type { TemplateResult } from '../component/template-parser';
import { disconnectNodes } from '../internals/disconnect-nodes';
import { hydrateTemplate } from '../internals/hydrate-template.ts';
import { createStruct } from './create-struct';

export const $await = <T>(source: Promise<T>) => {
    return {
        $then: (template: (value: T) => TemplateResult) => {
            let initialNodes: Element[] = [];
            let resolveErrorNodes: ((error: Error) => Element[]) | null = null;

            const struct = createStruct((root: Comment) => {
                root.before(...initialNodes);
                source
                    .then((result) => {
                        // Make sure the node is still connected
                        if (!root.isConnected) return;

                        const nodes = hydrateTemplate(template(result));
                        disconnectNodes(initialNodes);
                        root.before(...nodes);
                    })
                    .catch((error) => {
                        if (resolveErrorNodes) {
                            const nodes = resolveErrorNodes(error);
                            disconnectNodes(initialNodes);
                            root.before(...nodes);
                        }
                    });
            });

            const startNodes = (template: () => TemplateResult) => {
                initialNodes = hydrateTemplate(template());
                return Object.assign(struct, {
                    $catch: errorNodes,
                });
            };

            const errorNodes = (template: (error: Error) => TemplateResult) => {
                resolveErrorNodes = (error: Error) => hydrateTemplate(template(error));
                return Object.assign(struct, {
                    $else: startNodes,
                });
            };

            return Object.assign(struct, {
                $else: startNodes,
                $catch: errorNodes,
            });
        },
    };
};
