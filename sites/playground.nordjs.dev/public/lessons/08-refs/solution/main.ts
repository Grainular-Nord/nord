import { createRef, html, mount, on, ref } from '@grainular/nord';

const searchInput = createRef<HTMLInputElement>();

const App = () => html`
    <main>
        <h1>Refs</h1>
        <button type="button" ${on('click', () => searchInput.current?.focus())}>Focus the input</button>
        <input ${ref(searchInput)} type="search" placeholder="Search" />
    </main>
`;

mount(App, { to: document.querySelector('#app') });
