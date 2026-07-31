---
title: Lifecycle and cleanup
description: Attach resources to DOM lifetime and clean them up reliably.
layout: docs
lastUpdated: true
links:
    prev:
        text: Reactivity and grains
        link: /reactivity
    next:
        text: TypeScript
        link: /typescript
---

# Lifecycle and cleanup

Nørd ties registered cleanup to the lifetime of rendered DOM nodes. There is no component instance lifecycle: behavior belongs to the element or dynamic region that owns it.

## Mounting an application

`mount` renders a component into an element or document fragment. It creates the application DOM off-screen, hydrates its bindings, then replaces the target’s existing children in one step.

```ts title="main.ts"
import { mount } from '@grainular/nord';
import { App } from './app';

mount(App, { to: document.querySelector('#app') });
```

The target is the application boundary. Nørd observes it for DOM lifetime changes and uses it as the root for registered cleanup.

## Component evaluation

Components are ordinary functions evaluated while their surrounding fragment is created. Changing a grain does not call the component again; the reactive fragments, directives, and structs created during that initial evaluation own later DOM updates.

```ts title="clock.ts"
import { grain } from '@grainular/grains';
import { html } from '@grainular/nord';

export const Clock = () => {
    const now = grain(new Date());

    return html`<time>${now}</time>`;
};
```

Put setup that should run once per rendered fragment in the component function. Put DOM-dependent work in a directive or `mounted` callback instead.

## Mounted behavior

`mounted` runs after its host element is connected to the document. Return a function to clean up work when that element is removed.

```ts title="autofocus.ts"
import { html, mounted } from '@grainular/nord';

const autofocus = mounted((node) => {
    const input = node as HTMLInputElement;
    input.focus();

    return () => input.blur();
});

export const Search = () => html`<input ${autofocus} type="search" />`;
```

This is the right place for DOM APIs that require a connected element: focus, measurements, observers, or interaction setup.

## Registered cleanup

`createDirective` is the underlying cleanup mechanism. Its handler receives an element during hydration and may return a teardown function. Built-in directives such as `on` use the same mechanism, so event listeners are removed automatically.

```ts title="resize.ts"
import { createDirective, html } from '@grainular/nord';

const observeSize = createDirective((node) => {
    const observer = new ResizeObserver(() => console.log(node.clientWidth));
    observer.observe(node);

    return () => observer.disconnect();
});

export const Panel = () => html`<section ${observeSize}>Content</section>`;
```

The same pattern applies to subscriptions, timers, browser observers, and manually attached event listeners. Return their teardown from the directive that created them.

## External DOM removal

Cleanup is based on DOM connection, not on which code removed a node. If another library, browser API, or direct `element.remove()` call disconnects a Nørd-managed node, its registered cleanup still runs.

This makes embedding Nørd in an existing page less fragile: Nørd does not require every removal to pass through a framework-owned renderer.

## Nested applications

Any element can host a Nørd application, including an element rendered by another Nørd application. Each mount renders into its own target and updates its own DOM bindings.

```ts title="editor.ts"
const EditorHost = () => html`<div id="editor"></div>`;

mount(App, { to: document.querySelector('#app') });
mount(Editor, { to: document.querySelector('#editor') });
```

Nested applications do not need a provider, root context, or special integration layer. Use a shared grain or another ordinary JavaScript value when they should communicate.
