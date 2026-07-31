---
title: Creating structs
description: Build custom dynamic DOM regions with createStruct.
layout: docs
lastUpdated: true
links:
    prev:
        text: Other built-ins
        link: /structs/built-ins
    next:
        text: Server rendering
        link: /server-rendering
---

# Creating structs

Custom structs expose specialized rendering behavior without extending Nørd itself.

## `createStruct`

`createStruct` creates a fragment around a comment anchor. Its callback receives that anchor after the template mounts and may insert nodes immediately before it.

```ts
import { createStruct, html } from '@grainular/nord';

const timestamp = createStruct((anchor) => {
    const time = document.createElement('time');
    time.textContent = new Date().toLocaleTimeString();
    anchor.before(time);
});

const Clock = () => html`Rendered at ${timestamp}`;
```

## Rendering static output

Pass a second callback when the struct needs server-rendered output. It returns the HTML string included in the static snapshot; the first callback still supplies browser behaviour after hydration.

```ts
const greeting = createStruct(
    (anchor) => {
        const message = document.createElement('p');
        message.textContent = 'Hello from the browser.';
        anchor.before(message);
    },
    () => '<p>Hello from the server.</p>',
);
```

## Mounting dynamic behavior

The callback runs once per mounted struct. Use it to connect an API that cannot be expressed by a directive or one of the built-in structs. Keep the setup focused: create or hydrate the nodes the struct owns, then place them relative to the anchor.

## Tracking DOM nodes

Keep references to every node your struct creates if it may replace or remove them later. When a struct controls several nodes, insert them together with `anchor.before(...nodes)` and remove the same nodes during an update or cleanup.

Built-in structs already handle keyed lists, promises, and conditional branches. A custom struct should add a capability, not recreate those primitives.

## Cleanup

Return a cleanup function for timers, observers, subscriptions, or nodes that need explicit disposal. Nørd runs it when the anchor leaves the document, including when an ancestor is removed outside Nørd.

```ts
const tickingTime = createStruct((anchor) => {
    const time = document.createElement('time');
    const update = () => (time.textContent = new Date().toLocaleTimeString());

    update();
    const interval = window.setInterval(update, 1_000);
    anchor.before(time);

    return () => window.clearInterval(interval);
});
```
