import type { PureComponent } from '../component/component-types';

export const renderToString = (component: PureComponent) => {
    return component().render();
};
