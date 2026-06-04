import type { Grain } from '@grainular/grains';
import { html, type PropsWithChildren } from '@grainular/nord';
import './page-header.css';

export const PageHeader = ({ label, children }: PropsWithChildren<{ label: Grain<string> }>) => {
    return html`
         <div class="head">
            <h2>${label}</h2>
        </div>
        ${children}
    `;
};
