/** @format */

import { Directive, ReadonlyGrain } from '../../types';
import { PropType } from '../../types/enums/prop-type.enum';
import { TemplateDirective } from '../../types/template-directive';
import { ToStringTypes } from '../../types/to-string-types';
import { isGrain } from '../../utils/is-grain';
import { isNodeList } from '../../utils/is-node-list';
import { isNonNull } from '../../utils/is-non-null';
import { isObject } from '../../utils/is-object';

export const øGetPropTypeFromProp = (
    prop: ToStringTypes | TemplateDirective | Directive | NodeList | ReadonlyGrain<any>
): PropType => {
    if (isGrain(prop)) {
        return PropType.GRAIN;
    }

    if (isNonNull(prop) && isObject(prop) && Object.keys(prop).every((v) => v.startsWith('@'))) {
        return PropType.DIRECTIVE;
    }

    if (isNonNull(prop) && isObject(prop) && Object.keys(prop).every((v) => v.startsWith('&'))) {
        return PropType.TEMPLATE_DIRECTIVE;
    }

    if (isNodeList(prop)) {
        return PropType.NODE_LIST;
    }

    return PropType.PRIMITIVE;
};
