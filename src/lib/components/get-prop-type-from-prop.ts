/** @format */

import { Directive, ReadonlyGrain } from '../../types';
import { PropType } from '../../types/enums/prop-type.enum';
import { ToStringTypes } from '../../types/to-string-types';
import { isFunction } from '../../utils/is-function';
import { isGrain } from '../../utils/is-grain';
import { isNodeList } from '../../utils/is-node-list';
import { isNonNull } from '../../utils/is-non-null';

export const øGetPropTypeFromProp = (
    prop: ToStringTypes | Directive<Text | Element> | NodeList | ReadonlyGrain<any>
): PropType => {
    if (isGrain(prop)) {
        return PropType.GRAIN;
    }

    if (isNonNull(prop) && isFunction(prop)) {
        return PropType.DIRECTIVE;
    }
    if (isNodeList(prop)) {
        return PropType.NODE_LIST;
    }

    return PropType.PRIMITIVE;
};
