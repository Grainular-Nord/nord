const createStyleIdentifier = () => {
    return `nø-${Math.random().toString(16).slice(2, 8).padStart(6, '0')}`;
};

export type StyleFragment = {
    identifier: string;
    styles: string;
};

export const styleParser = (str: TemplateStringsArray, ...fragments: (string | number | boolean)[]): StyleFragment => {
    const identifier = createStyleIdentifier();
    return {
        identifier: identifier,
        styles: str.reduce((acc, str, idx) => `${acc}${str}${fragments[idx] ?? ''}`, ''),
    };
};
