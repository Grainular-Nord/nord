// A regex used to split attribute strings by the
// current id format.
export const identifierRegex = /<!--:(.{9}):-->/g;

export const createIdentifier = (idx: number) => {
    return `nø-${String(idx).padStart(6, '0')}`;
};
