---
title: Custom Directives
description: Package direct DOM behavior into a reusable function.
layout: lesson
playground:
    src: /lessons/10-custom-directives/
    title: Custom Directives
links:
    prev:
        text: Lifecycle
        link: /09-lifecycle
    next:
        text: Conditional Rendering
        link: /11-conditional-rendering
---

# Creating directives

`createDirective` turns a function receiving an element into a fragment that can be interpolated inside an opening tag. Wrap it in an outer function to create a directive that takes configuration — the outer function is ordinary JavaScript, with parameters and closures like any other.

```ts
const className = (value: string) =>
    createDirective((node) => {
        node.classList.add(value);
    });

const Notice = () => html`<p ${className('notice')}>Saved</p>`;
```

Directives compose by appearing together on the same element, and each one owns its own setup and cleanup independently. They're the right tool once behavior needs a browser API a template attribute can't express — an event listener with its own cleanup, for instance, rather than something you could just write as a static class.

:::Tip{title="Your task"}
`selectOnFocus` in `main.ts` has the right shape but its handler is empty. Add a `focus` listener to `input` that calls `input.select()`, and return a cleanup function that removes the listener.
:::

::::Details{title="Reveal solution"}
```ts title="main.ts"
import { createDirective, html, mount } from '@grainular/nord';

const selectOnFocus = createDirective<HTMLInputElement>((input) => {
    const select = () => input.select();
    input.addEventListener('focus', select);

    return () => input.removeEventListener('focus', select);
});

const App = () => html`
    <main>
        <h1>Custom directives</h1>
        <p>Click into the field — its value should select automatically.</p>
        <input ${selectOnFocus} type="text" value="Copy me" />
    </main>
`;

mount(App, { to: document.querySelector('#app') });
```
::::

Move on to [conditional rendering](/11-conditional-rendering) for control flow that updates only the active branch.
