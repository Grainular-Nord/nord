import { createStruct } from './create-struct';

export const $render = (trustedHtml: string) => {
    return createStruct((root) => {
        const template = document.createElement('template');
        template.innerHTML = trustedHtml;
        root.before(template.content);
    });
};
