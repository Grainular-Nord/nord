/** @format */

export type ProcessorProp = {
    token: string;
    process: (token: string, el: Element | Text) => void;
    raw: any;
};
