---
title: Attributes
description: Bind an attribute directly to a reactive value.
layout: lesson
playground:
    src: /lessons/07-attributes/
    title: Attributes
links:
    prev:
        text: Events
        link: /06-events
    next:
        text: Refs
        link: /08-refs
---

# Attributes

Attribute interpolation works exactly like text interpolation: pass a subscribable directly and Nørd keeps the attribute synchronized. This is usually clearer than reaching for a directive.

```ts
const enabled = grain(false);

const Toggle = () => html`
    <button disabled="${enabled}" aria-pressed="${enabled}" ${on('click', () => enabled.update((v) => !v))}>
        Toggle
    </button>
`;
```

Standard HTML boolean attributes follow HTML presence semantics: a truthy `disabled` renders the empty attribute, a falsy one removes it. Other attributes — including ARIA attributes — are serialized as ordinary strings, so `aria-pressed` becomes `"true"` or `"false"`.

:::Tip{title="Your task"}
Clicking Save in `main.ts` sets `saving` to `true` for 1.5 seconds, but nothing on the button reflects it. Bind `disabled` and `aria-busy` directly to `saving`, the same way `disabled` is bound in the example above.
:::

::::Details{title="Reveal solution"}
```ts title="main.ts"
import { grain } from '@grainular/grains';
import { html, mount, on } from '@grainular/nord';

const saving = grain(false);

const save = () => {
    saving.set(true);
    window.setTimeout(() => saving.set(false), 1500);
};

const App = () => html`
    <main>
        <h1>Attributes</h1>
        <button type="button" disabled="${saving}" aria-busy="${saving}" ${on('click', save)}>Save</button>
    </main>
`;

mount(App, { to: document.querySelector('#app') });
```

There's also `attr`, a directive that takes a record of attributes instead of interpolating them individually — reach for it when attributes are assembled dynamically, such as a `data-*` set built from props in a reusable component. For one or two known attributes on an element you're already writing out, direct interpolation like above stays the simplest option.
::::

Move on to [refs](/08-refs) for direct, typed access to a hydrated element.
