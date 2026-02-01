// A regex used to split attribute strings by the
// current id format.
export const identifierRegex = /<!--(nø-.{6})-->/g;

export const createIdentifier = (idx: string) => {
    return `nø-${idx.padStart(6, '0')}`;
};
