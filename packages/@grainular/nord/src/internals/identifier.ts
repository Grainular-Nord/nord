// A regex used to split attribute strings by the
// current id format.
export const identifierRegex = /<!--(nø-.{6})-->/g;

export const createIdentifier = () => {
    let _id = '';

    return {
        [Symbol.for('component.id')]: true,
        create: (idx: string) => {
            _id = `nø-${idx.padStart(6, '0')}`;
        },
        random: () => {
            _id = `nø-${Math.random().toString(16).slice(2, 8).padStart(6, '0')}`;
        },
        get: () => _id,
    };
};
