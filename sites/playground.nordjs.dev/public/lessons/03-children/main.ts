import { html, mount } from '@grainular/nord';
import { Card } from './card.ts';

const App = () =>
    Card({
        title: 'Composition',
        children: html`<p>Functions all the way down.</p>`,
    });

mount(App, { to: document.querySelector('#app') });
