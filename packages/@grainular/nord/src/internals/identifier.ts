let counter = 0;

// Function to create a identifier for the
// fragment ids. This creates a semi random
// 9 character long string, which we can
// find and parse later on.
export const identifier = () => {
    const prefix = Math.random().toString(36).padStart(9, '0');
    return `nø-${prefix.slice(2, 8 - counter.toString().length)}${counter++}`;
};

// A regex used to split attribute strings by the
// current id format.
export const identifierRegex = /<!--:(.{9}):-->/g;
