import { grain } from '@grainular/grains';
import { html, mount, on } from '@grainular/nord';

const App = () => {
    const count = grain(0);

    return html`
        <main>
            <h1>Grains</h1>
            <button type="button" ${on('click', () => count.update((value) => value + 1))}>Count: ${count}</button>
        </main>
    `;
};

mount(App, { to: document.querySelector('#app') });
