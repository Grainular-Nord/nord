/** @format */

import { ToStringTypes } from '../types/to-string-types';

export const getStringValue = (value: ToStringTypes) => {
    return (value === null || value === undefined ? '' : value).toString();
};
