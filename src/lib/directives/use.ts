/** @format */

export const Use = (handler: (element: Element) => void) => {
    return { '@use': handler };
};
