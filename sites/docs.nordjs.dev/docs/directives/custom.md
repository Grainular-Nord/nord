---
title: Creating directives
description: Build reusable DOM behavior with createDirective.
layout: docs
lastUpdated: true
links:
    prev:
        text: Portals
        link: /directives/portals
    next:
        text: Control flow
        link: /structs
---

# Creating directives

Custom directives package direct DOM behavior into composable functions. They are the smallest extension point in Nørd: receive an element, use normal browser APIs, and return cleanup when needed.

## `createDirective`

`createDirective` turns an element handler into a fragment that can be interpolated in an opening tag.

```ts title="focus.ts"
import { createDirective, html } from '@grainular/nord';

const autofocus = createDirective<HTMLInputElement>((input) => {
    input.focus();
});

const Search = () => html`<input ${autofocus} type="search" />`;
```

The handler runs while Nørd hydrates the element. Use `mounted` instead when behavior must wait until the element is connected to the document.

## Rendering static attributes

Pass an optional second callback when a directive also needs to contribute attributes during server rendering. Its return value is written into the host element's opening tag; the browser handler still runs normally when the page is mounted.

```ts title="current-page.ts"
const currentPage = createDirective(
    (link) => {
        link.setAttribute('aria-current', 'page');
    },
    () => 'aria-current="page"',
);

const Navigation = () => html`<a href="/docs" ${currentPage}>Documentation</a>`;
```

Return complete, valid attribute markup. The snapshot is raw HTML output, so escape any dynamic attribute values yourself; for ordinary known attributes, direct template interpolation is usually clearer.

## Accepting values

Wrap `createDirective` in a function to create a directive with configuration.

```ts title="class-name.ts"
const className = (value: string) =>
    createDirective((node) => {
        node.classList.add(value);
    });

const Notice = () => html`<p ${className('notice')}>Saved</p>`;
```

The outer function is ordinary JavaScript. Use parameters, closures, generics, and module imports as needed.

## Returning cleanup

Return a function whenever the directive creates a resource that outlives the current call stack.

```ts title="resize.ts"
const observeSize = createDirective((node) => {
    const observer = new ResizeObserver(() => console.log(node.getBoundingClientRect().width));
    observer.observe(node);

    return () => observer.disconnect();
});
```

Nørd calls the teardown when the host disconnects, including removal performed outside Nørd.

## Working with reactive values

Directives can subscribe to a value directly. Set the initial DOM state first, then return the subscription cleanup.

```ts title="text.ts"
import { createDirective, html, type Subscribable } from '@grainular/nord';

const text = (value: Subscribable<string>) =>
    createDirective((node) => {
        node.textContent = value();
        return value.subscribe((next) => {
            node.textContent = next;
        });
    });

const Status = ({ message }: { message: Subscribable<string> }) => html`<p ${text(message)}></p>`;
```

For ordinary text and attributes, interpolate the subscribable directly instead. A custom directive is useful when the target is a browser API rather than template content.

## Composition

Directives compose by appearing together on the same element. Each owns its own setup and cleanup.

```ts title="search.ts"
const Search = () => html` <input ${autofocus} ${on('input', updateQuery)} type="search" /> `;
```

Keep directives narrow and name them for the behavior they add. A directive should not need a component wrapper unless it also owns markup or state composition.
