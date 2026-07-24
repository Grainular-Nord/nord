---
title: Lists
description: Render a reactive collection with $each.
layout: lesson
playground:
    src: /lessons/12-lists/
    title: Lists
links:
    prev:
        text: Conditional Rendering
        link: /11-conditional-rendering
    next:
        text: Async Rendering
        link: /13-async-rendering
---

# Lists with `$each`

`$each` maps an iterable to independently managed DOM fragments. On its own, `.$as` uses each item's own object reference as its identity — which is the preferred default, since it needs nothing extra and Nørd can tell items apart by the same reference equality your own code already relies on.

```ts
const tasks = grain([{ id: 'write', title: 'Write the guide' }]);

const TaskList = () => html`
    <ul>
        ${$each(tasks).$as((task) => html`<li>${task.title}</li>`)}
    </ul>
`;
```

Reach for `.$withKey(...)` instead when object identity can't do the job — a list of primitives (which have no identity beyond their value), or a source that rebuilds every item on each update (a `.map()` that returns a new object for every entry, even ones that didn't logically change). A key function gives Nørd something stable to match against when the objects themselves aren't stable.

Set a new array when updating a grain so subscribers receive the change: `tasks.update((current) => [...current, newTask])` — note this only creates a new array and a new item; every _existing_ task keeps its original reference, so identity alone is enough for this list.

:::Tip{title="Your task"}
Two things are unfinished in `main.ts`: the `$each` call renders an empty fragment for every item, and `addTask` doesn't add anything. Complete `.$as` so each task shows as an `<li>`, and make `addTask` append a new task to the list.
:::

::::Details{title="Reveal solution"}

```ts title="main.ts"
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
```

::::

Move on to [async rendering](/13-async-rendering) to connect a promise to a region of the page.
