import { html, type PropsWithChildren } from '@grainular/nord';
import { Footer } from './footer';
import { Navigation } from './navigation';
export const Shell = ({ children }: PropsWithChildren) => {
    return html`
    ${Navigation()}
    ${children}
    ${Footer()}`;
};
