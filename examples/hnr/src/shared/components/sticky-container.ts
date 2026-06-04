import { html, type PropsWithChildren } from '@grainular/nord';
import './sticky-container.css';

export const StickyContainer = ({ children }: PropsWithChildren) => {
    return html`<div class="sticky-container">
        ${children}
    </div>`;
};
