export const trimWhitespace = (str: string) => {
    return str.replace(/\s{2,}/g, ' ').trim();
};
