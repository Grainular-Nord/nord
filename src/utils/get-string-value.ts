/** @format */

import { ToStringTypes } from '../types/to-string-types';

export const getStringValue = (value: ToStringTypes) => {
    return (value === null ? 'null' : value === undefined ? 'undefined' : value).toString();
};
