import { createDirective, html, mount } from '@grainular/nord';

const selectOnFocus = createDirective<HTMLInputElement>((input) => {
    const select = () => input.select();
    input.addEventListener('focus', select);

    return () => input.removeEventListener('focus', select);
});

const App = () => html`
    <main>
        <h1>Custom directives</h1>
        <p>Click into the field — its value should select automatically.</p>
        <input ${selectOnFocus} type="text" value="Copy me" />
    </main>
`;

mount(App, { to: document.querySelector('#app') });
