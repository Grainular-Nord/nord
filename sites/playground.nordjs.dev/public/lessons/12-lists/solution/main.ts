import { grain } from '@grainular/grains';
import { $each, html, mount, on } from '@grainular/nord';

const tasks = grain([
    { id: 'write', title: 'Write the guide' },
    { id: 'publish', title: 'Publish it' },
]);

const addTask = () => {
    tasks.update((current) => [...current, { id: crypto.randomUUID(), title: 'New task' }]);
};

const App = () => html`
    <main>
        <h1>Lists</h1>
        <button type="button" ${on('click', addTask)}>Add a task</button>
        <ul>
            ${$each(tasks).$as((task) => html`<li>${task.title}</li>`)}
        </ul>
    </main>
`;

mount(App, { to: document.querySelector('#app') });
