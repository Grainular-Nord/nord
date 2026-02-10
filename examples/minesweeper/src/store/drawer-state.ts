import { grain, readonly } from '@grainular/grains';

const drawer = grain(false);

export const drawerState = {
    expanded: readonly(drawer),
    toggle: () => drawer.set(!drawer()),
    close: () => drawer.set(false),
};
