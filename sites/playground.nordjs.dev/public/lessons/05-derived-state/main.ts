import { combined, derived, grain } from '@grainular/grains';
import { html, mount } from '@grainular/nord';

const quantity = grain(2);
const unitPrice = grain(12);

// TODO: combine `quantity` and `unitPrice`, then derive their product.
// Replace this placeholder with a real `derived(...)` value.
const total = grain(0);

const App = () => html`
    <main>
        <h1>Invoice</h1>
        <p>${quantity} × $${unitPrice} = $${total}</p>
    </main>
`;

mount(App, { to: document.querySelector('#app') });
