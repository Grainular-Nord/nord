---
title: Reactivity and grains
description: Connect subscribable values and grains to the DOM.
layout: docs
---

# Reactivity and grains

Nørd updates individual DOM bindings when their subscribed values change. Components do not run again, and the surrounding DOM stays in place.

## Subscribable values

Nørd does not require a particular state library. A reactive value only needs to be a callable getter with a `subscribe` method that returns an unsubscribe function.

```ts title="subscribable.ts"
type Subscribable<T> = {
    (): T;
    subscribe(listener: (value: T) => void): () => void;
};
```

Interpolating a subscribable creates a binding at that exact location. When it changes, Nørd updates the corresponding text node or attribute and disposes of the subscription with the owning DOM node.

:::Tip{title="Reactivity is explicit"}
Nørd does not collect dependencies while a component runs. Pass a subscribable to the DOM location that should update, or use a struct when a value controls a region of DOM.
:::

## Creating grains

`grain` is the small writable primitive provided by `@grainular/grains`. A grain is a function: call it to read its current value.

```ts title="count.ts"
import { grain } from '@grainular/grains';

const count = grain(0);

count(); // 0
```

Grains are synchronous closures. They hold no global context, can be declared in any module or component, and can be passed like any other value.

By default, a grain notifies subscribers when its next value is not `Object.is` equal to the current one. Pass a comparison function when a value needs a different update boundary. Return `true` when both values should be treated as equal.

```ts title="user.ts"
const user = grain(initialUser, (current, next) => current.id === next.id);
```

Use a custom comparison deliberately: it decides whether Nørd receives an update at all.

## Updating writable grains

Writable grains provide `set` for a replacement value and `update` when the next value depends on the current one.

```ts title="count.ts"
count.set(3);
count.update((value) => value + 1);

count(); // 4
```

Updates notify subscribers synchronously when the value changes according to `Object.is`. There is no implicit batching or scheduled component render.

## Readonly state

`readonly` exposes the readable, subscribable side of a writable grain without its `set` and `update` methods. It is useful when a module owns state but should not let consumers change it directly.

```ts title="session.ts"
import { grain, readonly } from '@grainular/grains';

const session = grain<Session | null>(null);

export const currentSession = readonly(session);
export const signIn = (next: Session) => session.set(next);
export const signOut = () => session.set(null);
```

`currentSession` can still be read, subscribed to, or interpolated in a template. The writable grain remains private to the module that owns it.

## Derived values

`derived` creates a readonly subscribable by mapping another grain. Use `combined` first when a value depends on several sources.

```ts title="total.ts"
import { combined, derived, grain } from '@grainular/grains';

const quantity = grain(2);
const unitPrice = grain(12);
const invoice = combined([quantity, unitPrice]);
const total = derived(invoice, ([quantity, price]) => quantity * price);

total(); // 24
```

Derived values are readonly; update their source grains instead.

## Composing reactive state

`combined` joins several grains into one readonly tuple, which is useful when one binding depends on several sources. `flattened` unwraps a grain that contains another grain and follows whichever inner grain is currently selected.

```ts title="selection.ts"
import { flattened, grain } from '@grainular/grains';

const primary = grain('Primary');
const secondary = grain('Secondary');
const selected = grain(primary);
const label = flattened(selected);

label(); // 'Primary'
selected.set(secondary);
label(); // 'Secondary'
```

Subscribers to `label` are moved from the previous inner grain to the next one automatically. This is useful for active selections, replaceable stores, and any state that chooses another reactive value.

## Local and shared state

Where a grain is declared determines who owns it. A grain inside a component function is created for each component fragment. A grain in module scope is shared by every consumer of that module.

```ts title="counter.ts"
import { grain } from '@grainular/grains';
import { html } from '@grainular/nord';

const sharedCount = grain(0);

export const LocalCounter = () => {
    const localCount = grain(0);

    return html`<p>${localCount} / ${sharedCount}</p>`;
};
```

Neither choice needs a provider or special scope. Pass a grain through props when the parent should retain ownership; keep it local when the component owns the state.

## Using another reactive source

If another reactive source already has a synchronous getter and subscription API, wrap it with `syncReactive`. The resulting readonly subscribable works anywhere a grain does.

```ts title="store.ts"
import { syncReactive } from '@grainular/nord';

const currentUser = syncReactive({
    get: () => store.user,
    subscribe: (notify) => store.subscribe(notify),
});

const Profile = () => html`<p>${currentUser}</p>`;
```

The wrapper subscribes to the external source only while Nørd has active consumers, then releases it automatically. Keep external adaptation at the application boundary; components can remain unaware of the state library behind a subscribable.
