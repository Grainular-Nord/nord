import type { Grain } from '@grainular/grains';
import type { Params } from './params';

export type LinkOptions = {
    activeClass?: string;
    params?: Grain<Params>;
    matchMode?: 'exact' | 'prefix';
};
