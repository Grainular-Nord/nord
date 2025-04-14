import type { TemplateResult } from '../component/template-parser';
import { DOM } from '../internals/dom';
import { Symbols } from '../internals/symbols';

export const $await = <T>(source: Promise<T>) => {
    return {
        $then: (resolver: (value: T) => TemplateResult) => {
            let elseNodeResolver: (() => TemplateResult) | null = null;
            let errorNodeResolver: (error: Error) => TemplateResult = (error) => error.message;

            const struct = (root: Comment) => {
                root.textContent += '$await:';
                let initialNodes: Element[];
                if (elseNodeResolver) {
                    initialNodes = DOM.insertFragment(root, DOM.getHydratedFragment(elseNodeResolver()));
                }

                source
                    .then((data) => {
                        DOM.removeNodes(initialNodes);
                        DOM.insertFragment(root, DOM.getHydratedFragment(resolver(data)));
                    })
                    .catch((error) => {
                        DOM.removeNodes(initialNodes);
                        DOM.insertFragment(root, DOM.getHydratedFragment(errorNodeResolver(error)));
                    });
            };

            const startNodes = (run: () => TemplateResult) => {
                elseNodeResolver = run;
                return Object.assign(struct, {
                    [Symbols.STRUCT]: Symbols.STRUCT,
                    $catch: errorNodes,
                });
            };
            const errorNodes = (run: (error: Error) => TemplateResult) => {
                errorNodeResolver = run;
                return Object.assign(struct, {
                    [Symbols.STRUCT]: Symbols.STRUCT,
                    $else: startNodes,
                });
            };

            return Object.assign(struct, {
                [Symbols.STRUCT]: Symbols.STRUCT,
                $else: startNodes,
                $catch: errorNodes,
            });
        },
    };
};
