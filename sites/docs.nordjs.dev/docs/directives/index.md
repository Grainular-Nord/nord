---
title: Directives
description: Apply behavior and DOM properties directly to rendered elements.
layout: docs
---

# Directives

Directives receive an element and attach behavior, state, or lifecycle resources to it. They are small fragments placed directly inside an element’s opening tag.

## Where directives are used

Interpolate a directive where an HTML attribute would normally appear. The directive itself renders no markup; it receives the host element while Nørd hydrates the template.

```ts title="counter.ts"
import { html, on } from '@grainular/nord';

const increment = () => console.log('increment');

const Counter = () => html` <button ${on('click', increment)}>Increment</button> `;
```

This keeps DOM behavior next to the element it affects. Directives target one element; use a [struct](/structs) when behavior owns a dynamic region of DOM instead.

## Built-in directives

Nørd provides a small set of direct DOM primitives:

- `on` attaches a typed event listener.
- `attr` applies several static or reactive attributes from a record.
- `mounted` runs after an element is connected to the document.
- `ref` assigns the element to a ref object.
- `portal` moves an element to another DOM target.

Each remains ordinary JavaScript. There is no directive registry, naming convention, or template compiler involved.

## Reactive directive values

Directives can use subscribables just like components do. `attr` accepts a record whose values may be reactive; it updates only the affected attributes.

```ts title="button.ts"
import { attr, html, type Subscribable } from '@grainular/nord';

const SaveButton = ({ saving }: { saving: Subscribable<boolean> }) => html`
    <button ${attr({ disabled: saving, 'aria-busy': saving })}>Save</button>
`;
```

Custom directives may subscribe to a value directly when they need to synchronize another DOM API. Keep that subscription within the directive so its cleanup follows the host element.

## Cleanup

When a directive returns a function, Nørd registers it as cleanup for its host element. Built-in `on` uses this automatically, and custom directives use the same rule for observers, timers, subscriptions, or manually attached listeners.

Cleanup follows DOM connection rather than a framework-owned unmount path. Removing the element through ordinary browser APIs or another library still triggers its registered teardown.

## Creating a directive

`createDirective` turns a function receiving an element into a reusable directive. It is the extension point behind the built-ins and is covered in [Creating directives](/directives/custom).

Start with built-ins whenever they express the behavior directly. Create a directive when the same DOM behavior needs a meaningful name or appears in more than one place.
