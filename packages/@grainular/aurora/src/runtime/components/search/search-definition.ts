import type { AuroraComponentDefinition } from '../../../lib/config/config';

export const searchDefinition: AuroraComponentDefinition = {
    name: 'search',
    client: true,
    component: () => import('./search'),
};
