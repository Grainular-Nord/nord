import { grain } from '@grainular/grains';
import { html, mount, on } from '@grainular/nord';

const saving = grain(false);

const save = () => {
    saving.set(true);
    window.setTimeout(() => saving.set(false), 1500);
};

const App = () => html`
    <main>
        <h1>Attributes</h1>
        <button type="button" disabled="${saving}" aria-busy="${saving}" ${on('click', save)}>Save</button>
    </main>
`;

mount(App, { to: document.querySelector('#app') });
