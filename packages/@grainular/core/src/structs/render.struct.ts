import { Symbols } from '../internals/symbols';

export const $render = (trustedHtml: string) => {
    return Object.assign(
        (root: Comment) => {
            root.textContent += '$render:';
            const template = document.createElement('template');
            template.innerHTML = trustedHtml;
            root.after(template.content);
        },
        { [Symbols.STRUCT]: Symbols.STRUCT },
    );
};
