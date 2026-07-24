---
title: Events
description: Attach a typed browser event listener with on.
layout: lesson
playground:
    src: /lessons/06-events/
    title: Events
links:
    prev:
        text: Derived State
        link: /05-derived-state
    next:
        text: Attributes
        link: /07-attributes
---

# Events with `on`

`on` accepts a browser event name, a listener, and optional listener options. TypeScript infers the event object from the event name, so `event.clientX` is typed without any extra annotation.

```ts
const increment = (event: MouseEvent) => {
    console.log(event.clientX);
};

const Counter = () => html`<button ${on('click', increment)}>Increment</button>`;
```

The listener is an ordinary function — it can read grains, update state, or call browser APIs. Nørd removes the listener automatically when its host element disconnects.

:::Tip{title="Your task"}
`trackPosition` in `main.ts` is defined but never attached to anything. Wire it up to the box's `mousemove` event with `on`, so moving your mouse over it updates the coordinates.
:::

::::Details{title="Reveal solution"}

```ts title="main.ts"
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
```

::::

Move on to [attributes](/07-attributes) to keep an element's attributes in sync with a grain.
