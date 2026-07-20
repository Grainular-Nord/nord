import { $await, html, mount } from '@grainular/nord';

const fetchUser = () =>
    new Promise<{ name: string }>((resolve) => {
        window.setTimeout(() => resolve({ name: 'Nørd' }), 1500);
    });

const user = fetchUser();

const App = () => html`
    <main>
        <h1>Async rendering</h1>
        ${$await(user)
            .$then((value) => html`<p>Hello, ${value.name}.</p>`)
            .$pending(() => html`<p aria-busy="true">Loading…</p>`)}
    </main>
`;

mount(App, { to: document.querySelector('#app') });
