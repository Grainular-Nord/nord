---
title: API reference
description: Reference for Nørd’s public application, directive, struct, and component APIs.
layout: docs
---

# API reference

This reference lists the public exports provided by Nørd and Grains.

## Application

### `mount`

`mount(component, { to })` creates and hydrates a component fragment inside an `Element` or `DocumentFragment`, replacing the target’s existing children. It returns a cleanup function for the mounted application and throws when no valid target is supplied.

### `renderToString`

`renderToString(component)` evaluates a component and returns its HTML snapshot as a string. It is the server-side entry point for static output; browser activation remains a separate concern and can be applied only where it is needed.

### `syncReactive`

`syncReactive({ get, subscribe })` adapts an external reactive source into a readonly Nørd subscribable. The source is read synchronously through `get`, subscribed lazily when Nørd needs it, and unsubscribed once its final consumer disconnects.

### `Subscribable`

`Subscribable<T>` is Nørd's reactive input contract: a callable getter paired with `subscribe(listener)`. Nørd accepts a compatible value wherever a reactive interpolation, attribute, or control-flow source is expected; Grains are one implementation of this contract.

```ts
type Subscribable<T> = {
    (): T;
    subscribe(listener: (value: T) => void): () => void;
};
```

## Templates and components

### `html`

`html` is the tagged template function used to create a `ComponentFragment`. Static strings become HTML, while interpolated primitives, fragments, and subscribable values become the corresponding dynamic parts of that fragment.

### `ComponentFragment`

`ComponentFragment` is the value returned by `html` and by Nørd components. It represents a fragment that can be rendered to an HTML string or hydrated into live DOM nodes, allowing fragments to compose without a separate virtual-node type.

### `Fragment`

`Fragment` is the lower-level render unit behind component fragments, directives, structs, primitive values, and reactive bindings. Most application code should use `ComponentFragment`; use `Fragment` when writing a reusable low-level primitive such as a directive or struct.

### `PureComponent`

`PureComponent` is the conventional type for a component function returning a `ComponentFragment`. It accepts no argument when a component has no props, or a typed props object when it does; any function with the same shape is a valid Nørd component.

### `ComponentProps`

`ComponentProps` is the base constraint for component prop objects. It is useful when writing reusable component helpers or generic component types, while most components can simply infer their own explicit props object.

### `PropsWithChildren`

`PropsWithChildren<T>` adds a `children` field to a props object. Children are passed explicitly as a string, `ComponentFragment`, or `null`; they are ordinary props rather than a separate slot or special component syntax.

## Directives

### `attr`

`attr(record)` applies each key/value pair in a record as an attribute on the host element. Values may be static or subscribable; reactive attributes stay synchronized and their subscriptions are cleaned up with the element.

### `on`

`on(event, listener, options?)` attaches a typed browser event listener to the host element. The listener is removed automatically when that element is disconnected, so event behavior can remain colocated with the template that owns it.

### `mounted`

`mounted(callback)` runs a callback when its host element enters the document. A cleanup function returned by the callback is registered for removal, making it suitable for browser integrations that need a real, connected element.

### `portal`

`portal(target)` moves its host element into another DOM element while preserving the directive’s normal lifecycle. It is useful for overlays, dialogs, and similar UI that must render outside the local DOM hierarchy.

### `ref` and `createRef`

`createRef<T>()` creates a `{ current: null }` reference object, and `ref(reference)` assigns the hydrated host element to it. Refs provide direct, typed access to an element when a directive or event callback is not the right place for that work.

### `createDirective`

`createDirective(handler)` creates a directive from a function receiving the host element. The handler may return a cleanup function, which Nørd invokes when the element is removed, and forms the extension point behind custom element behavior.

## Structs

### `$if`

`$if(condition)` creates a conditional region from a boolean getter or subscribable. Chain `.$then(...)` for the true branch and optionally `.$else(...)` for the false branch; the active fragment is replaced when a reactive condition changes.

### `$switch`

`$switch(value)` selects one fragment from several cases. Chain `.$case(value, render)` for matching values and finish with `.$default(render)` for the fallback; a subscribable source updates the selected fragment as its value changes.

### `$each`

`$each(source)` renders an array from a getter or subscribable and reconciles it when the source changes. Use `.$as(render)` for stable object identities or `.$withKey(key).$as(render)` to give entries explicit, durable DOM identity.

### `$await`

`$await(value)` renders a promise or immediate value through `.$then(render)`, with optional `.$pending(render)` and `.$catch(render)` states. It provides a small async region without requiring the surrounding component to become asynchronous.

### `$suspend`

`$suspend(component, { pending, error })` is an async component boundary with required loading and error fragments. It accepts a function that returns a component fragment or a promise for one, which makes it particularly useful for dynamically imported UI.

### `$try`

`$try(render).$catch(fallback)` creates a synchronous error boundary for a dynamic region. It catches errors thrown while the initial fragment is created and renders the fallback instead; it does not handle errors that occur later in event handlers or asynchronous work.

### `$render`

`$render(source)` renders the `ComponentFragment` held by a subscribable and replaces the region whenever that fragment changes. It is useful when the fragment itself, rather than a value inside it, is the reactive unit.

### `$tag`

`$tag({ as, children, use }, onMount?)` creates an HTML element programmatically, with optional child content, directives, and lifecycle callback. It is mainly useful when the tag name is dynamic or when element creation needs to be driven by data rather than static template markup.

### `$unsafeHtml`

`$unsafeHtml(trustedHtml)` inserts a raw HTML string without parsing it as a Nørd template. It does not sanitize its input, so it must only receive HTML that is fully trusted and never unsanitized user content.

### `createStruct`

`createStruct(handler, snapshot?)` creates a dynamic region anchored by a comment node. The handler owns DOM inserted around that anchor and may return cleanup; the optional snapshot supplies its server-rendered HTML, making this the extension point for custom structs.

## Grains

### `grain`

`grain(initialValue, compare?)` creates a synchronous writable reactive value. Call it to read its current value, use `.set(next)` or `.update(updater)` to change it, and `.subscribe(listener)` to observe changes; updates notify subscribers only when the comparison reports a difference.

### `derived`

`derived(source, map)` creates a readonly grain by transforming one source grain. Reads apply the mapping immediately, and subscriptions are forwarded from the source with the mapped value.

### `combined`

`combined(sources)` combines several grains into one readonly grain containing their current values as a typed tuple or array. It notifies subscribers when any source changes, which is useful when a calculation depends on several independent values.

### `flattened`

`flattened(nested)` turns a grain containing another grain into one readonly grain. It follows the current inner grain, switches subscriptions when the outer grain changes, and exposes only the inner value.

### `readonly`

`readonly(source)` exposes the read and subscribe surface of a grain without its write methods. It is a lightweight way to share state with consumers while keeping mutation with the owner.
