export type ContactModel = {
    name: {
        first: string;
        last: string;
    };
    category: string | null;
    age: number | null;
    message: string;
    consent: boolean;
};

export const initialContactModel: ContactModel = {
    name: { first: '', last: '' },
    category: null,
    age: null,
    message: '',
    consent: false,
};
