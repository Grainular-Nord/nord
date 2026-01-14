import type { PureComponent } from '../component/component-types';

/**
 * Renders the component tree to a html string for SSR.
 * @param component
 */
export const renderToString = (component: PureComponent) => {
    return component().render();
};
