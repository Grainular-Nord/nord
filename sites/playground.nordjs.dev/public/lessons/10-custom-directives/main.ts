import { createDirective, html, mount } from '@grainular/nord';

// TODO: select the input's text whenever it's focused, so clicking in
// selects everything (handy for a field people usually copy in full).
const selectOnFocus = createDirective<HTMLInputElement>((input) => {});

const App = () => html`
    <main>
        <h1>Custom directives</h1>
        <p>Click into the field — its value should select automatically.</p>
        <input ${selectOnFocus} type="text" value="Copy me" />
    </main>
`;

mount(App, { to: document.querySelector('#app') });
