export { createDirective } from './directives/create-directive';
export { on } from './directives/on';
import { grain } from '@grainular/grains';
import { mount } from './application/mount';
import { templateParser as html } from './component/template-parser';
import { on } from './directives/on';
import { $if } from './structs/$if.struct';

const enabled = grain(true);
const App = () => {
    return html`
        <button ${on('click', () => enabled.set(!enabled()))}>Toggle</button>
        ${$if(enabled, html`<div>${enabled}</div>`)}
    `;
};

mount(App, { to: document.querySelector('body') });
