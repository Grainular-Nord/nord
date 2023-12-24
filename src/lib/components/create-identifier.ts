/** @format */

export const øCreateIdentifier = () => {
    return `nø-${crypto.randomUUID().slice(4, 10).replaceAll('-', '')}`;
};
