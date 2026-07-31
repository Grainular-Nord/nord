---
title: Portals
description: Render content into another part of the document.
layout: docs
lastUpdated: true
links:
    prev:
        text: Refs and lifecycle
        link: /directives/refs-and-lifecycle
    next:
        text: Creating directives
        link: /directives/custom
---

# Portals

Portals move an element into a target outside its original template position. The element keeps its Nørd bindings, directives, and normal DOM lifetime.

## Creating a portal

Pass a target element to `portal` and place the directive on the element that should move.

```ts title="dialog.ts"
import { html, portal } from '@grainular/nord';

const portalTarget = typeof document === 'undefined' ? undefined : document.body;

const Dialog = () => html`
    <section ${portal(portalTarget)} class="dialog">
        <h2>Dialog</h2>
    </section>
`;
```

The section is declared alongside its component but becomes a child of `document.body` after browser hydration. Portals are a browser concern, so guard the target when the component may also render on the server.

## Choosing a target

Use a stable element that exists before the portal hydrates. `document.body` is a good default for dialogs, menus, and notifications; a dedicated overlay root is useful when an application needs to control stacking or styling.

```ts title="overlay-root.ts"
const overlayRoot = document.querySelector('#overlays');

const Menu = () => html`<div ${portal(overlayRoot)}>Menu</div>`;
```

`portal` throws when the target is missing, which makes an incorrectly ordered setup fail close to its source.

## Reactive portal content

The portal only changes where the host element lives. Interpolations, grains, directives, and structs inside it continue to update normally.

```ts title="toast.ts"
import { html, portal, type Subscribable } from '@grainular/nord';

const Toast = ({ message }: { message: Subscribable<string> }) => html`
    <aside ${portal(document.body)} role="status">${message}</aside>
`;
```

There is no separate portal renderer or state boundary to coordinate.

## Cleanup

When Nørd disposes the portalled element, the portal directive removes it from its target. Cleanup returned by directives inside the element still follows that element’s DOM lifetime.

Treat the target as portal infrastructure rather than component content. The component owns the moved element; the target only provides its destination.

## Common use cases

Portals are useful for UI that must escape local clipping, stacking, or layout constraints:

- dialogs and popovers;
- context menus and tooltips;
- toast and notification regions;
- drag previews.

Use a portal for DOM placement, not for communication. Pass grains, callbacks, or ordinary props when portalled content needs to coordinate with its source component.
