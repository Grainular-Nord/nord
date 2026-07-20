import { grain } from '@grainular/grains';
import { html, mount, mounted } from '@grainular/nord';

const time = grain(new Date().toLocaleTimeString());

const tick = mounted(() => {
    const interval = window.setInterval(() => time.set(new Date().toLocaleTimeString()), 1000);

    return () => window.clearInterval(interval);
});

const App = () => html`
    <main>
        <h1>Lifecycle</h1>
        <time ${tick}>${time}</time>
    </main>
`;

mount(App, { to: document.querySelector('#app') });
