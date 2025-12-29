import { createStruct } from './create-struct';

export const $unsafeHtml = (trustedHtml: string) => {
    return createStruct(
        (root) => {
            const template = document.createElement('template');
            template.innerHTML = trustedHtml;
            root.replaceWith(template.content);
        },
        () => trustedHtml,
    );
};
