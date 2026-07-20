import { html, mount } from '@grainular/nord';

// TODO: interpolate a greeting into the empty <h1> below.
const App = () => html`
    <main>
        <h1></h1>
        <p>Edit this file and the preview updates automatically.</p>
    </main>
`;

mount(App, { to: document.querySelector('#app') });
