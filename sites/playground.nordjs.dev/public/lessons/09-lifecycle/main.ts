import { grain } from '@grainular/grains';
import { html, mount, mounted } from '@grainular/nord';

const time = grain(new Date().toLocaleTimeString());

// TODO: start a `setInterval` that updates `time` every second, and
// return a cleanup function that clears it.
const tick = mounted(() => {});

const App = () => html`
    <main>
        <h1>Lifecycle</h1>
        <time ${tick}>${time}</time>
    </main>
`;

mount(App, { to: document.querySelector('#app') });
