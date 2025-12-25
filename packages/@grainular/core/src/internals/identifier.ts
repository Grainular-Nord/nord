/** @format */

// export const identifier = () => `nø-${crypto.randomUUID().slice(4, 11).replaceAll('-', '')}`;

let counter = 0;
export const identifier = () => {
    const prefix = Math.random().toString(36).padStart(9, '0');
    return `nø-${prefix.slice(2, 8 - counter.toString().length)}${counter++}`;
};
