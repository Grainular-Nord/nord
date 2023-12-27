/** @format */

import { Subscriber } from './subscriber';

export type Observable = {
    subscribe: (subscriber: Subscriber<any>) => () => void;
};
