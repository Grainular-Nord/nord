/** @format */

import { Directive } from '../../../dist/types';
import { ReadonlyGrain } from '../../types';
import { ProcessorProp } from '../../types/processor-prop';
import { TemplateDirective } from '../../types/template-directive';
import { ToStringTypes } from '../../types/to-string-types';
import { emptyNodeList } from '../../utils/empty-node-list';
import { øGetProcessorByPropType } from './get-processor-by-prop-type';
import { øGetPropTypeFromProp } from './get-prop-type-from-prop';
import { øHydrate } from './hydrate';

// Create a new DomParser instance
const parser = new DOMParser();

export const øEvaluateComponentTemplate = (
    templateFragments: TemplateStringsArray,
    ...injects: (ReadonlyGrain<any> | TemplateDirective | Directive | ToStringTypes | NodeList)[]
): NodeList => {
    const props: ProcessorProp[] = [];
    const evaluationResults = templateFragments.flatMap((fragment, index) => {
        let token: string | null = null;
        const prop = injects.at(index);

        if (prop !== undefined) {
            token = crypto.randomUUID();
            props.push({
                token,
                raw: prop,
                process: (token: string, el: Element | Text) => {
                    const propType = øGetPropTypeFromProp(prop);
                    const processor = øGetProcessorByPropType(propType);
                    processor(el, token, prop);
                },
            });
        }

        return [fragment, token];
    });

    // parse the evaluation result and hydrate the DOM tree
    const parsed = parser.parseFromString(evaluationResults.join(''), 'text/html');
    øHydrate(parsed, ...props);

    // return the parsed child nodes or fall back to an empty node list
    return parsed.querySelector('body')?.childNodes ?? emptyNodeList();
};
