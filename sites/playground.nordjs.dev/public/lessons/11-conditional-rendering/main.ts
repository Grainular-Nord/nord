import { grain } from '@grainular/grains';
import { $if, html, mount, on } from '@grainular/nord';

const signedIn = grain(false);
const toggle = () => signedIn.update((value) => !value);

// TODO: add an `.$else(...)` branch that renders a "Sign in" link when
// `signedIn` is false.
const App = () => html`
    <main>
        <h1>Conditional rendering</h1>
        <button type="button" ${on('click', toggle)}>Toggle</button>
        ${$if(signedIn).$then(() => html`<p>Welcome back.</p>`)}
    </main>
`;

mount(App, { to: document.querySelector('#app') });
