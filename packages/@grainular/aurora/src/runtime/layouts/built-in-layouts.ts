import type { AuroraLayoutDefinition } from '../../lib/config/config';
import { Docs } from './docs';
import { Page } from './page';

export const builtInLayouts: AuroraLayoutDefinition[] = [
    {
        name: 'page',
        layout: async () => ({ default: Page }),
    },
    {
        name: 'docs',
        layout: async () => ({ default: Docs }),
    },
];
