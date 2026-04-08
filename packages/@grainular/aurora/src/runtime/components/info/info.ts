import { type PropsWithChildren, html } from '@grainular/nord';

export const Info = ({ children }: PropsWithChildren) => {
    return html`<div class="aurora-info">${children}</div>`;
};
