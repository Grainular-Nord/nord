---
title: Derived State
description: Compute a readonly value from one or more grains.
layout: lesson
playground:
    src: /lessons/05-derived-state/
    title: Derived State
links:
    prev:
        text: Grains
        link: /04-grains
    next:
        text: Events
        link: /06-events
---

# Derived & combined state

`derived` creates a readonly subscribable by mapping another grain. Use `combined` first when a value depends on several sources — it joins them into one readonly tuple.

```ts
const quantity = grain(2);
const unitPrice = grain(12);
const invoice = combined([quantity, unitPrice]);
const total = derived(invoice, ([quantity, price]) => quantity * price);

total(); // 24
```

Derived values are readonly and update automatically whenever a source grain changes — there's no manual recomputation to wire up.

:::Tip{title="Your task"}
`total` in `main.ts` is just a static grain stuck at `0`. Replace it with a real derived value: combine `quantity` and `unitPrice`, then derive their product.
:::

::::Details{title="Reveal solution"}

```ts title="main.ts"
import { combined, derived, grain } from '@grainular/grains';
import { html, mount } from '@grainular/nord';

const quantity = grain(2);
const unitPrice = grain(12);

const invoice = combined([quantity, unitPrice]);
const total = derived(invoice, ([quantity, price]) => quantity * price);

const App = () => html`
    <main>
        <h1>Invoice</h1>
        <p>${quantity} × $${unitPrice} = $${total}</p>
    </main>
`;

mount(App, { to: document.querySelector('#app') });
```

::::

Move on to [events](/06-events) to attach behavior directly to an element.
