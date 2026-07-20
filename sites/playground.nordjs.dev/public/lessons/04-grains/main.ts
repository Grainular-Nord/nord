import { grain } from '@grainular/grains';
import { html, mount, on } from '@grainular/nord';

const App = () => {
    const count = grain(0);

    // TODO: call `count.update(...)` inside the click handler so the
    // button's label increases by 1 on every click.
    return html`
        <main>
            <h1>Grains</h1>
            <button type="button" ${on('click', () => {})}>Count: ${count}</button>
        </main>
    `;
};

mount(App, { to: document.querySelector('#app') });
