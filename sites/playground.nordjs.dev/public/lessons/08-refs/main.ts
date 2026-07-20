import { createRef, html, mount, on, ref } from '@grainular/nord';

const searchInput = createRef<HTMLInputElement>();

// TODO: apply `ref(searchInput)` to the input below, then focus it from
// the button's click handler using `searchInput.current`.
const App = () => html`
    <main>
        <h1>Refs</h1>
        <button type="button" ${on('click', () => {})}>Focus the input</button>
        <input type="search" placeholder="Search" />
    </main>
`;

mount(App, { to: document.querySelector('#app') });
