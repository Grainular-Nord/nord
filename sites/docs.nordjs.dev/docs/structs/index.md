---
title: Control flow
description: Control dynamic DOM regions with conditions, lists, and asynchronous work.
layout: docs
lastUpdated: true
links:
    prev:
        text: Creating directives
        link: /directives/custom
    next:
        text: Conditional rendering
        link: /structs/conditional-rendering
---

# Control flow

Nørd structs control regions of the DOM: a conditional branch, a list of items, or the result of an asynchronous operation. They are fragments, so they can appear anywhere a template interpolation can appear.

## How structs work

Each struct has a small comment anchor in the rendered template. When its input changes, it adds, removes, or replaces only the nodes immediately before that anchor. The rest of the component remains untouched.

This keeps control flow local. A condition does not rerun its parent component; a list update does not recreate its neighbours.

## Built-in structs

Use `$if` and `$switch` for conditional content. `$each` renders collections with keyed reconciliation. `$await`, `$suspend`, and `$try` handle asynchronous or fallible work.

`$render`, `$tag`, and `$unsafeHtml` are lower-level tools for the cases where the normal template syntax is not the right fit.

## Reactive dependencies

Most control-flow structs accept either a subscribable value or a getter. A subscribable keeps its region updated; a getter is evaluated when the struct mounts and then left alone.

```ts
import { grain } from '@grainular/grains';
import { $if, html } from '@grainular/nord';

const visible = grain(true);

const Message = () => html`${$if(visible).$then(() => html`<p>Visible</p>`)}`;
```

## DOM ownership

A struct owns the nodes it renders. Replacing a branch, removing an item, or unmounting the containing component disconnects those nodes and runs their registered cleanup. Nodes outside the struct remain in place.

This is why struct callbacks return fragments instead of already-mounted nodes: Nørd can give each rendered region a complete lifecycle.

## Creating a struct

The built-ins cover ordinary application flow. Reach for `createStruct` only when you need a reusable primitive that manages its own DOM region, such as an integration with a browser API or a specialised renderer.

See [Creating structs](/structs/custom) for the lower-level API.
