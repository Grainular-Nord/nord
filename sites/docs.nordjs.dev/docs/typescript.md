---
title: TypeScript
description: Type Nørd components, props, fragments, directives, and refs.
layout: docs
---

# TypeScript

Nørd uses ordinary TypeScript types without requiring a framework-specific compiler. Most templates and components infer their types naturally; name a Nørd type only when it makes a public API clearer.

## Component types

Any function returning `html` is a component. Let TypeScript infer that shape for local components, or use `PureComponent` when exporting a component whose signature should be explicit.

```ts title="greeting.ts"
import { html, type PureComponent } from '@grainular/nord';

type GreetingProps = { name: string };

export const Greeting: PureComponent<GreetingProps> = ({ name }) => html`
    <h1>Hej, ${name}!</h1>
`;
```

`PureComponent` is a convention, not a special runtime type. It accepts no argument for a component without props and one typed props object otherwise.

## Props and children

Props are ordinary object types. `PropsWithChildren<T>` adds a `children` field when a component accepts rendered content.

```ts title="card.ts"
import { html, type PropsWithChildren } from '@grainular/nord';

type CardProps = PropsWithChildren<{ title: string }>;

export const Card = ({ title, children }: CardProps) => html`
    <section>
        <h2>${title}</h2>
        ${children}
    </section>
`;
```

Children can be a string, `ComponentFragment`, or `null`. They remain an explicit prop, so a component can instead expose named regions or several fragment props whenever that describes its API better.

## Component fragments

`html` returns a `ComponentFragment`. You rarely need to write the type inside a component, but it is useful for functions that accept or return renderable content.

```ts title="content.ts"
import { html, type ComponentFragment } from '@grainular/nord';

const withFrame = (content: ComponentFragment): ComponentFragment => html`
    <article class="frame">${content}</article>
`;
```

A fragment is not a virtual DOM node or component instance. It is the value Nørd renders and hydrates, and it can be passed through ordinary TypeScript APIs.

## Directive types

`createDirective` is generic over the host element. Name the element type when the directive relies on element-specific APIs; otherwise inference from `Element` is sufficient.

```ts title="select-on-focus.ts"
import { createDirective, html } from '@grainular/nord';

const selectOnFocus = createDirective<HTMLInputElement>((input) => {
    const select = () => input.select();
    input.addEventListener('focus', select);

    return () => input.removeEventListener('focus', select);
});

const Search = () => html`<input ${selectOnFocus} type="search" />`;
```

The lower-level `Fragment` type exists for helpers that create directives or structs. Application components generally return `ComponentFragment` instead.

## Refs

`createRef<T>()` gives `current` the element type you expect. It is `null` until Nørd hydrates the host element, so normal null checking remains useful.

```ts title="search.ts"
import { createRef, html, on, ref } from '@grainular/nord';

const searchInput = createRef<HTMLInputElement>();

const SearchButton = () => html`
    <button ${on('click', () => searchInput.current?.focus())}>Search</button>
    <input ${ref(searchInput)} type="search" />
`;
```

Use a directive when behavior belongs to an element itself. Use a ref when another part of the component needs direct, typed access to that element.

## Using Nørd without TypeScript

TypeScript is optional. The runtime API is plain JavaScript: templates are tagged literals, components are functions, and grains are callable values with methods.

```js title="counter.js"
import { grain } from '@grainular/grains';
import { html, on } from '@grainular/nord';

export const Counter = () => {
    const count = grain(0);

    return html`<button ${on('click', () => count.update((value) => value + 1))}>
        Count: ${count}
    </button>`;
};
```

Add types where they help communicate a boundary. Nørd does not require annotations, decorators, generated declarations, or a special template transform to work correctly.
