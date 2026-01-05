import { categories } from './category.model';

export type ContactModel = {
    name: {
        first: string;
        last: string;
    };
    category: string;
    age: number | null;
    message: string;
    consent: boolean;
};

export const initialContactModel: ContactModel = {
    name: { first: '', last: '' },
    category: categories.at(0) ?? '',
    age: null,
    message: '',
    consent: false,
};
