/** @format */

import { ToStringTypes } from '../lib/components/evaluate-component-template';

export const getStringValue = (value: ToStringTypes) => {
    return (value === null ? 'null' : value === undefined ? 'undefined' : value).toString();
};
