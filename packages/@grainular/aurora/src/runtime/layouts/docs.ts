import { html } from '@grainular/nord';
import type { LayoutComponent } from './core';

export const Docs: LayoutComponent = ({ content }) => {
    return html`
    <section class="application-content docs" style="background: red">
        ${content}
    </section>
    `;
};
