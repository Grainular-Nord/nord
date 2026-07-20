---
title: Grains
description: Create, read, and update a writable grain.
layout: lesson
playground:
    src: /lessons/04-grains/
    title: Grains
links:
    prev:
        text: Children
        link: /03-children
    next:
        text: Derived State
        link: /05-derived-state
---

# Grains

`grain` is the small writable primitive provided by `@grainular/grains`. A grain is a function: call it to read its current value. Writable grains provide `.set(next)` for a replacement value and `.update(updater)` when the next value depends on the current one.

```ts
const count = grain(0);

count(); // 0
count.update((value) => value + 1);
count(); // 1
```

Interpolating a grain into a template creates a direct binding — updating it refreshes only that text node, nothing else re-renders.

:::Tip{title="Your task"}
The button's click handler in `main.ts` is empty. Call `count.update(...)` inside it so every click increases the number shown in the button.
:::

::::Details{title="Reveal solution"}
```ts title="main.ts"
import { grain } from '@grainular/grains';
import { html, mount, on } from '@grainular/nord';

const App = () => {
    const count = grain(0);

    return html`
        <main>
            <h1>Grains</h1>
            <button type="button" ${on('click', () => count.update((value) => value + 1))}>Count: ${count}</button>
        </main>
    `;
};

mount(App, { to: document.querySelector('#app') });
```

`count.set(count() + 1)` reaches the same result and is just as valid here — `.update` only matters once the next value can't be computed from a value you already have in scope, or when two updates could otherwise race against a value that's gone stale by the time you read it.
::::

Move on to [derived state](/05-derived-state) to compute a value from more than one grain.
