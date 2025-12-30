import { identifier } from '../internals/identifier';

export type StyleFragment = {
    id: string;
    attach: () => void;
};

const styleCache = new Map<string, CSSStyleSheet>();

export const cssParser = (str: TemplateStringsArray, ...fragments: (string | number)[]): StyleFragment => {
    const id = identifier();
    const style = str.reduce((current, element, idx) => `${current}${element}${fragments[idx] ?? ''}`, '');

    return {
        id,
        attach: () => {
            if (!styleCache.has(id)) {
                const sheet = new CSSStyleSheet();
                styleCache.set(id, sheet);
                sheet.replaceSync(`[${id}] { ${style} }`);
                document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheet];
            }
        },
    };
};
