import { createStruct } from '@grainular/nord';
import { context } from '../store/context';

export const $pageTitle = (title?: string) => {
    return createStruct(() => {
        const { title: appTitle } = context();
        const element = document.querySelector('title');

        if (!element) return;
        if (element && title) {
            element.textContent = `${title} | ${appTitle}`;
        }

        return () => {
            element.textContent = appTitle || '';
        };
    });
};
