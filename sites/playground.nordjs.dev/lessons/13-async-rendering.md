---
title: Async Rendering
description: Represent pending and resolved states with $await.
layout: lesson
playground:
    src: /lessons/13-async-rendering/
    title: Async Rendering
links:
    prev:
        text: Lists
        link: /12-lists
    next:
        text: Hello Nørd
        link: /01-hello-nord
---

# Async rendering

`$await` connects a promise to a local region of the page — the rest of the component is unaffected while it's pending. `.$then` receives the resolved value:

```ts
const quote = fetch('/api/quote').then((response) => response.json());

const Quote = () => html` ${$await(quote).$then((value) => html`<blockquote>${value.text}</blockquote>`)} `;
```

On its own, that region is simply blank until the promise settles. Chain `.$pending(...)` to render something while it's still in flight, and `.$catch(...)` to handle a rejection — both take the same kind of callback as `.$then`.

:::Tip{title="Your task"}
`main.ts` simulates a 1.5 second fetch, and the page is blank the whole time it's pending. Add a `.$pending(...)` branch so something shows up immediately.
:::

::::Details{title="Reveal solution"}

```ts title="main.ts"
import { $await, html, mount } from '@grainular/nord';

const fetchUser = () =>
    new Promise<{ name: string }>((resolve) => {
        window.setTimeout(() => resolve({ name: 'Nørd' }), 1500);
    });

const user = fetchUser();

const App = () => html`
    <main>
        <h1>Async rendering</h1>
        ${$await(user)
            .$then((value) => html`<p>Hello, ${value.name}.</p>`)
            .$pending(() => html`<p aria-busy="true">Loading…</p>`)}
    </main>
`;

mount(App, { to: document.querySelector('#app') });
```

::::

That's the last lesson in this preview, so **next** loops back to [Hello Nørd](/). From here, the [API reference](https://nordjs.dev/api-reference) covers everything in Nørd and Grains in one place.
