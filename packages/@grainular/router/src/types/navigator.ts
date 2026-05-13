import type { NavigatorState } from './navigator-state';

export type Navigator = (route: string, init?: NavigatorState) => Promise<void>;
