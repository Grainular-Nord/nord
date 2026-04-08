import { grain } from '@grainular/grains';
import type { AuroraConfig } from '../../lib/config';

export const context = grain<Required<AuroraConfig>['site']>({});
