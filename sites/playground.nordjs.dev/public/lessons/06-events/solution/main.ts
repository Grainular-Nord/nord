import { grain } from '@grainular/grains';
import { html, mount, on } from '@grainular/nord';

const position = grain('Move your mouse over the box');

const trackPosition = (event: MouseEvent) => {
    position.set(`X: ${event.clientX}, Y: ${event.clientY}`);
};

const App = () => html`
    <main>
        <h1>Events</h1>
        <div class="box" ${on('mousemove', trackPosition)}>${position}</div>
    </main>
`;

mount(App, { to: document.querySelector('#app') });
