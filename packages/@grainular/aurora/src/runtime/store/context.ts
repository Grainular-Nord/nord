import { grain } from '@grainular/grains';
import type { AuroraContext } from '../../lib/config/config';

export const context = grain<Partial<AuroraContext>>({});
