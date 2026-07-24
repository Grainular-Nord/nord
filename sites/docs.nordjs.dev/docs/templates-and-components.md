---
title: Templates and components
description: Build Nørd interfaces from tagged templates and ordinary functions.
layout: docs
---

# Templates and components

Templates describe DOM fragments, while components organize them with ordinary functions.

## HTML templates

Nørd uses the `html` tagged template to create DOM fragments. The literal parts are regular HTML, so elements, attributes, comments, and browser semantics remain visible in the component source. There is no JSX transform or separate template file to configure.

```ts title="welcome.ts"
import { html } from '@grainular/nord';

const name = 'Nørd';

export const Welcome = () => html`
    <main>
        <h1>Hej, ${name}!</h1>
        <p>This is an ordinary HTML template literal.</p>
    </main>
`;
```

Interpolations can contain primitive values, subscribable values, component fragments, directives, or structs. Nørd places the appropriate fragment at that location, whether it belongs in text content, an attribute, or a dynamic DOM region.

:::Tip{title="Fragments are ordinary values"}
Fragments have no special context or ownership. Declare them wherever it makes sense, pass them through functions or props, store them in variables, and render them later. A fragment becomes DOM only where you interpolate it.
:::

## Components

Components are functions that return the `ComponentFragment` created by `html`. They are evaluated when the surrounding fragment is created, not repeatedly on every state change. Reactive bindings and structs inside the resulting fragment own subsequent updates.

```ts title="greeting.ts"
import { html } from '@grainular/nord';

export const Greeting = () => html`<h1>Hej!</h1>`;
```

`ComponentFragment` and `PureComponent` are useful types when a signature benefits from being explicit, but neither is required for Nørd to recognize a component. A function returning `html` is enough.

## Component props

Props are ordinary objects passed to a component function. There is no compiler transform, special argument position, or reactive-prop wrapper: values and functions are passed exactly as they would be to any other JavaScript function.

```ts title="greeting.ts"
import { html, type PureComponent } from '@grainular/nord';

type GreetingProps = { name: string; punctuation?: string };

export const Greeting: PureComponent<GreetingProps> = ({ name, punctuation = '!' }) =>
    html`<h1>Hej, ${name}${punctuation}</h1>`;
```

The component is then called in a template with its props object: `${Greeting({ name: 'Nørd' })}`. A prop can itself be a grain, callback, component fragment, or any other value required by the component.

## Children

Children are props with a familiar name, not a separate syntax feature. `PropsWithChildren<T>` adds a `children` field to a component’s own props type; callers provide the child string or fragment explicitly.

```ts title="card.ts"
import { html, type PropsWithChildren } from '@grainular/nord';

type CardProps = PropsWithChildren<{ title: string }>;

export const Card = ({ title, children }: CardProps) => html`
    <section>
        <h2>${title}</h2>
        ${children}
    </section>
`;

const article = Card({
    title: 'A card',
    children: html`<p>Its content is a normal fragment.</p>`,
});
```

This keeps component APIs explicit. A component can call its prop `children`, use a different prop name, accept several content fragments, or not accept child content at all.

## Composition

Components compose by calling other components in a template. Because the child has already returned a fragment, there is no component instance object or implicit lifecycle hierarchy to manage.

```ts title="page.ts"
import { html } from '@grainular/nord';
import { Card } from './card';

const Header = () => html`<header>Nørd</header>`;

export const Page = () => html`
    ${Header()}
    <main>${Card({ title: 'Composition', children: html`<p>Functions all the way down.</p>` })}</main>
`;
```

Local state belongs wherever the function is called. Put a grain inside a component for a fresh value per component fragment, in a module for shared state, or pass it through props when ownership should remain with the parent.

## Reactive values in templates

When a subscribable value is interpolated into a template, Nørd creates a direct binding to that DOM location. Updating the value changes the text or attribute binding in place; it does not call the component again or recreate its surrounding elements.

```ts title="counter.ts"
import { grain } from '@grainular/grains';
import { html, on } from '@grainular/nord';

export const Counter = () => {
    const count = grain(0);

    return html`
        <button aria-label="${count}" ${on('click', () => count.update((value) => value + 1))}>Count: ${count}</button>
    `;
};
```

## Attributes

Attribute interpolation works exactly like text interpolation: pass a subscribable directly and Nørd keeps the attribute synchronized. This is often clearer than reaching for a directive.

```ts title="toggle.ts"
const enabled = grain(false);

const Toggle = () => html`
    <button disabled="${enabled}" aria-pressed="${enabled}" ${on('click', () => enabled.update((value) => !value))}>
        Toggle
    </button>
`;
```

Standard HTML boolean attributes follow HTML presence semantics. A truthy `disabled`, `checked`, `hidden`, or `required` binding renders the empty attribute; a falsy value removes it. Other attributes, including ARIA attributes, are serialized as ordinary strings, so `aria-pressed` becomes `"true"` or `"false"`.

Grains are the default reactive values in these docs, but Nørd accepts any compatible subscribable. Continue with [Reactivity and grains](/reactivity) for writable state, derived values, and integrating other reactive sources.

## Familiar patterns that do not apply

Nørd resembles the platform more than component frameworks with compiler transforms or render loops. Do not carry these patterns across unchanged:

- **Do not interpolate a getter:** `${() => count()}` is not a reactive binding. Interpolate the subscribable itself: `${count}`.
- **Do not use `onClick`, `@click`, or similar template attributes for events.** They are not event bindings. Use a directive: `${on('click', handler)}`.
- **Do not interpolate a component function without calling it.** Render `${Counter()}`, not `${Counter}`.
- **Do not expect a component to run again when state changes.** Components create fragments once; interpolate a subscribable or use a control-flow struct for the part that must update.
- **Do not use a virtual-DOM mental model.** Nørd updates a bound node directly, and structs own their explicit DOM regions.
