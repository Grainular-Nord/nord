import { html } from '@grainular/nord';
import { content, meta } from './content.md';
export const App = () => {
    console.log({ content, meta });

    return html`<div>Hello World</div> ${content}`;
};
