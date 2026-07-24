---
title: Components & Props
description: Pass typed props to ordinary component functions.
layout: lesson
playground:
    src: /lessons/02-components-and-props/
    title: Components & Props
links:
    prev:
        text: Hello Nørd
        link: /01-hello-nord
    next:
        text: Children
        link: /03-children
---

# Components & props

Components are functions that return the `ComponentFragment` created by `html`. Props are ordinary objects — there's no compiler transform or special argument position, values are passed exactly as they would be to any other function.

```ts
type GreetingProps = { name: string; punctuation?: string };

export const Greeting: PureComponent<GreetingProps> = ({ name, punctuation = '!' }) =>
    html`<h1>Hej, ${name}${punctuation}</h1>`;
```

:::Tip{title="Your task"}
`greeting.ts` destructures `name` and `punctuation` but never uses them, and `punctuation` has no default. Interpolate both into the `<h1>`, and give `punctuation` a default value of `"!"` so callers can omit it.
:::

::::Details{title="Reveal solution"}

```ts title="greeting.ts"
import { html, type PureComponent } from '@grainular/nord';

type GreetingProps = { name: string; punctuation?: string };

export const Greeting: PureComponent<GreetingProps> = ({ name, punctuation = '!' }) => html`
    <h1>Hej, ${name}${punctuation}</h1>
`;
```

::::

Move on to [children](/03-children) to see how a component accepts rendered content, not just plain values.
