/** @format */

import { ReadonlyGrain } from '../../types';
import { PropType } from '../../types/enums/prop-type.enum';
import { isGrain } from '../../utils/is-grain';
import { isNodeList } from '../../utils/is-node-list';
import { TemplateDirective, TemplateFunction, ToStringTypes } from './evaluate-component-template';

export const øGetPropTypeFromProp = (
    prop: ToStringTypes | TemplateDirective | TemplateFunction | ReadonlyGrain<any>
): PropType => {
    if (isGrain(prop)) {
        return PropType.GRAIN;
    }

    if (prop !== null && typeof prop === 'object' && Object.keys(prop).every((v) => v.startsWith('@'))) {
        return PropType.DIRECTIVE;
    }

    if (isNodeList(prop)) {
        return PropType.NODE_LIST;
    }

    return PropType.PRIMITIVE;
};
