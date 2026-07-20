import { combined, derived, grain } from '@grainular/grains';
import { html, mount } from '@grainular/nord';

const quantity = grain(2);
const unitPrice = grain(12);

const invoice = combined([quantity, unitPrice]);
const total = derived(invoice, ([quantity, price]) => quantity * price);

const App = () => html`
    <main>
        <h1>Invoice</h1>
        <p>${quantity} × $${unitPrice} = $${total}</p>
    </main>
`;

mount(App, { to: document.querySelector('#app') });
