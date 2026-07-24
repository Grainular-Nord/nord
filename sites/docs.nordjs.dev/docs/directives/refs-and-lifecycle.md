---
title: Refs and lifecycle
description: Access mounted elements and connect behavior to their lifetime.
layout: docs
---

# Refs and lifecycle

Refs expose DOM elements, while lifecycle directives manage resources attached to them. Both work with ordinary browser nodes rather than component instances.

## Creating a ref

`createRef` creates an object with a `current` field. Pass the expected element type to retain native DOM autocomplete and checking.

```ts title="search.ts"
import { createRef } from '@grainular/nord';

const searchInput = createRef<HTMLInputElement>();
```

Before hydration, `current` is `null`. A ref does not query the document or create an element by itself.

## Applying a ref

Apply `ref` to the element that should populate the reference.

```ts title="search.ts"
import { html, ref } from '@grainular/nord';

const Search = () => html` <input ${ref(searchInput)} type="search" placeholder="Search" /> `;
```

Once Nørd hydrates the input, `searchInput.current` is that exact `HTMLInputElement`.

## Mounted callbacks

Use `mounted` when behavior belongs to the host element itself and must wait until it is connected to the document.

```ts title="focus.ts"
import { html, mounted } from '@grainular/nord';

const focus = mounted((node) => {
    (node as HTMLInputElement).focus();
    return () => {};
});

const Search = () => html`<input ${focus} type="search" />`;
```

This is suitable for focus, element measurement, and browser observers. A mounted callback receives the element directly, so it often removes the need for a ref.

## Cleanup callbacks

Return a function from `mounted` or `createDirective` to release anything the element owns.

```ts title="observe.ts"
const observe = mounted((node) => {
    const observer = new ResizeObserver(() => console.log(node.getBoundingClientRect().width));
    observer.observe(node);

    return () => observer.disconnect();
});
```

Nørd runs that cleanup when the host disconnects, including when it is removed through ordinary DOM APIs outside Nørd.

## Choosing between refs and directives

Use a ref when another event handler or part of the component needs to access an element. Use `mounted` or `createDirective` when behavior is attached to one element and can stay colocated with it.

Refs are an escape hatch for direct access, not a replacement for ordinary declarative template composition.
