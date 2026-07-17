import { grain } from '@grainular/grains';
import { $each, html, mount, on } from '@grainular/nord';

const tasks = grain([
    { id: 'write', title: 'Write the guide' },
    { id: 'publish', title: 'Publish it' },
]);

const addTask = () => {
    // TODO: append a new task to `tasks` using `.update(...)`.
};

const App = () => html`
    <main>
        <h1>Lists</h1>
        <button type="button" ${on('click', addTask)}>Add a task</button>
        <ul>
            <!-- TODO: complete .$as so each task renders as a list item. -->
            ${$each(tasks).$as(() => html``)}
        </ul>
    </main>
`;

mount(App, { to: document.querySelector('#app') });
