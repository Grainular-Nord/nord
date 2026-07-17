---
title: Hello Nørd
description: Mount your first Nørd component.
layout: lesson
playground:
    src: /lessons/01-hello-nord/
    title: Hello Nørd
links:
    next:
        text: Components & Props
        link: /02-components-and-props
---

# Hello Nørd

Every Nørd application starts the same way: a component built with the `html` tagged template, mounted onto an element. `html` returns a fragment; `mount` renders it into a real DOM element and keeps it up to date.

The editor on the right is a real, live file — no bundler, no install step, just this code and `@grainular/nord` loaded straight from a CDN as native browser modules. Edit it and the preview below updates automatically.

:::Tip{title="Your task"}
The `<h1>` in `main.ts` is empty. Interpolate a greeting into it — `${...}` works inside a template the same way it does in any JavaScript template literal.
:::

::::Details{title="Reveal solution"}
```ts title="main.ts"
import { html, mount } from '@grainular/nord';

const App = () => html`
    <main>
        <h1>Hello, Nørd 👋</h1>
        <p>Edit this file and the preview updates automatically.</p>
    </main>
`;

mount(App, { to: document.querySelector('#app') });
```
::::

When you're ready, move on to [components and props](/02-components-and-props).
