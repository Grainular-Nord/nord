import { type PropsWithChildren, html } from '@grainular/nord';

export const Tip = ({ children }: PropsWithChildren) => {
    return html`<div style="background: gray; border: 1px solid darkgray; padding-inline: 1rem;">${children}</div>`;
};
