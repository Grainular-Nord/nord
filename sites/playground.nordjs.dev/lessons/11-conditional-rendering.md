---
title: Conditional Rendering
description: Update only the active branch with $if.
layout: lesson
playground:
    src: /lessons/11-conditional-rendering/
    title: Conditional Rendering
links:
    prev:
        text: Custom Directives
        link: /10-custom-directives
    next:
        text: Lists
        link: /12-lists
---

# Conditional rendering

`$if` takes a boolean subscribable and a `.$then(...)` branch to render when it's true. Chain `.$else(...)` when both states need content — each callback is only evaluated for the branch that becomes active, and the surrounding template is untouched while a branch changes.

```ts
const Status = () => html`
    ${$if(isOnline)
        .$then(() => html`<p>Connected.</p>`)
        .$else(() => html`<p>Offline — retrying…</p>`)}
`;
```

:::Tip{title="Your task"}
Toggling `signedIn` to `false` in `main.ts` currently renders nothing. Add a `.$else(...)` branch that shows a "Sign in" link instead.
:::

::::Details{title="Reveal solution"}
```ts title="main.ts"
import { grain } from '@grainular/grains';
import { $if, html, mount, on } from '@grainular/nord';

const signedIn = grain(false);
const toggle = () => signedIn.update((value) => !value);

const App = () => html`
    <main>
        <h1>Conditional rendering</h1>
        <button type="button" ${on('click', toggle)}>Toggle</button>
        ${$if(signedIn)
            .$then(() => html`<p>Welcome back.</p>`)
            .$else(() => html`<a href="#">Sign in</a>`)}
    </main>
`;

mount(App, { to: document.querySelector('#app') });
```
::::

Move on to [lists](/12-lists) to render a reactive collection.
