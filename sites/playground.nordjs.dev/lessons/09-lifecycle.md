---
title: Lifecycle
description: Connect a resource to an element's time in the document.
layout: lesson
playground:
    src: /lessons/09-lifecycle/
    title: Lifecycle
links:
    prev:
        text: Refs
        link: /08-refs
    next:
        text: Custom Directives
        link: /10-custom-directives
---

# Lifecycle with `mounted`

`mounted` runs a callback once its host element enters the document — the right place for browser APIs that need a real, connected node: focus, measurement, observers, timers. Return a function from the callback and Nørd runs it when the element disconnects.

```ts
const observeSize = mounted((node) => {
    const observer = new ResizeObserver(() => console.log(node.clientWidth));
    observer.observe(node);

    return () => observer.disconnect();
});
```

Cleanup follows DOM connection, not a framework-owned unmount path — it still runs even if something removes the element through an ordinary DOM API.

`mounted` is where a *resource's* lifetime gets tied to an element — a timer, an observer, a subscription. It's not where you'd update that element's content directly: a grain interpolated into the template already does that, and stays consistent with how every other lesson here binds state to the DOM.

:::Tip{title="Your task"}
The `<time>` element in `main.ts` shows the time once and never updates. Start a `setInterval` inside `tick` that keeps the `time` grain current, and return a cleanup function that clears the interval. The template already interpolates `time` — you shouldn't need to touch any DOM node directly.
:::

::::Details{title="Reveal solution"}
```ts title="main.ts"
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
```
::::

Move on to [custom directives](/10-custom-directives) to package this kind of behavior into a reusable function.
