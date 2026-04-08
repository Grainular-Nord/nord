import { html } from '@grainular/nord';
import type { LayoutComponent } from './core';

export const Page: LayoutComponent = ({ content }) => {
    return html`
    <section class="application-content">
        ${content}
    </section>
    `;
};
