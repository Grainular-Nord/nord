import { $await, html, mount } from '@grainular/nord';

const fetchUser = () =>
    new Promise<{ name: string }>((resolve) => {
        window.setTimeout(() => resolve({ name: 'Nørd' }), 1500);
    });

const user = fetchUser();

// TODO: add a `.$pending(...)` branch so something shows up while
// `user` is still resolving, instead of a blank page for 1.5 seconds.
const App = () => html`
    <main>
        <h1>Async rendering</h1>
        ${$await(user).$then((value) => html`<p>Hello, ${value.name}.</p>`)}
    </main>
`;

mount(App, { to: document.querySelector('#app') });
