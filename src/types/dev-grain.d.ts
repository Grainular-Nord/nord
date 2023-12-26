/** @format */

import { Grain } from './grain';

export type DevGrain = Grain<any> & { readonly isGrain: true };
