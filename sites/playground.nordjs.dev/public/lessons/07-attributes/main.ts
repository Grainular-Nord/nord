import { grain } from '@grainular/grains';
import { html, mount, on } from '@grainular/nord';

const saving = grain(false);

const save = () => {
    saving.set(true);
    window.setTimeout(() => saving.set(false), 1500);
};

// TODO: bind `disabled` and `aria-busy` directly to `saving` on the
// button, the same way you'd interpolate any other subscribable.
const App = () => html`
    <main>
        <h1>Attributes</h1>
        <button type="button" ${on('click', save)}>Save</button>
    </main>
`;

mount(App, { to: document.querySelector('#app') });
