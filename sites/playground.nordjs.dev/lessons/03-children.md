---
title: Children
description: Pass rendered content to a component as an ordinary prop.
layout: lesson
playground:
    src: /lessons/03-children/
    title: Children
links:
    prev:
        text: Components & Props
        link: /02-components-and-props
    next:
        text: Grains
        link: /04-grains
---

# Children

Children are props with a familiar name, not a separate syntax feature. `PropsWithChildren<T>` adds a `children` field to a component's own props type; callers provide the child fragment explicitly, just like any other prop.

```ts
type CardProps = PropsWithChildren<{ title: string }>;

export const Card = ({ title, children }: CardProps) => html`
    <section>
        <h2>${title}</h2>
        ${children}
    </section>
`;
```

:::Tip{title="Your task"}
`card.ts` renders `title` but drops `children` entirely — `main.ts` passes a paragraph in, but nothing shows up below the heading. Destructure `children` and interpolate it into the template.
:::

::::Details{title="Reveal solution"}

```ts title="card.ts"
import { html, type PropsWithChildren } from '@grainular/nord';

type CardProps = PropsWithChildren<{ title: string }>;

export const Card = ({ title, children }: CardProps) => html`
    <section class="box">
        <h2>${title}</h2>
        ${children}
    </section>
`;
```

::::

Move on to [grains](/04-grains) for the state that actually changes over time.
