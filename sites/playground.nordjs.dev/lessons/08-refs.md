---
title: Refs
description: Get direct, typed access to a hydrated element.
layout: lesson
playground:
    src: /lessons/08-refs/
    title: Refs
links:
    prev:
        text: Attributes
        link: /07-attributes
    next:
        text: Lifecycle
        link: /09-lifecycle
---

# Refs

`createRef` creates an object with a `current` field; `current` is `null` until Nørd hydrates the element the ref is applied to. Use a ref when another part of the component — an event handler, typically — needs direct access to an element it doesn't otherwise own.

```ts
const box = createRef<HTMLDivElement>();

const Measure = () => html`
    <div ${ref(box)}>Some content</div>
    <button ${on('click', () => console.log(box.current?.clientWidth))}>Log width</button>
`;
```

Refs are an escape hatch for direct access, not a replacement for ordinary template composition — reach for one only when a directive on the element itself isn't the right fit.

:::Tip{title="Your task"}
`searchInput` in `main.ts` is created but never connected to anything. Apply `ref(searchInput)` to the `<input>`, then call `searchInput.current?.focus()` in the button's click handler.
:::

::::Details{title="Reveal solution"}
```ts title="main.ts"
import { createRef, html, mount, on, ref } from '@grainular/nord';

const searchInput = createRef<HTMLInputElement>();

const App = () => html`
    <main>
        <h1>Refs</h1>
        <button type="button" ${on('click', () => searchInput.current?.focus())}>Focus the input</button>
        <input ${ref(searchInput)} type="search" placeholder="Search" />
    </main>
`;

mount(App, { to: document.querySelector('#app') });
```
::::

Move on to [lifecycle](/09-lifecycle) to connect behavior to an element's lifetime.
