/** @format */

import { Grain } from '../../dist/types';

export type DevGrain = Grain<any> & { isGrain: true; grainId: ReturnType<Crypto['randomUUID']> };
