import { html, mount } from '@grainular/nord';

const App = () => html`
    <main>
        <h1>Hello, Nørd 👋</h1>
        <p>Edit this file and the preview updates automatically.</p>
    </main>
`;

mount(App, { to: document.querySelector('#app') });
