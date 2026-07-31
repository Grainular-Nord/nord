---
title: Nørd Overview
description: Nørd's core ideas and a quick tour of its rendering API.
layout: docs
links:
    next:
        text: Getting started
        link: /getting-started
---

# Nørd

:::Tip
Want to get started? Skip to [Getting started](/getting-started).
:::

Nørd is a small reactive framework for building web interfaces with JavaScript or TypeScript. It stays close to the platform: ordinary functions compose interfaces, tagged templates create DOM fragments, and reactive values update only the DOM locations that use them.

## Tenets

- **Stay close to JavaScript.** Components are functions, templates use tagged template literals instead of JSX, and state can live in ordinary closures or modules.
- **Keep the runtime small.** Nørd has no third-party runtime dependencies, compiler, JSX transform, framework plugin, or special file format.
- **Update the DOM directly.** Reactive changes update their bound nodes without re-running components, using a virtual DOM, or diffing a tree.
- **Use the browser platform.** HTML, CSS, events, and browser APIs remain available, with directives for controlled DOM access.
- **Do not prescribe architecture.** Nørd works in a standalone page, an existing site, or a larger application without imposing a file or state structure.
- **Render static HTML where it fits.** Server rendering supports static output and independently activated islands rather than stateful incremental hydration.

## Core concepts

- **Templates and components** use `html` tagged templates and ordinary functions to create fragments.
- **Reactive values** such as Grains subscribe DOM bindings. Any compatible value with a `subscribe` method can be used instead.
- **Directives** attach behavior to one element: events, attributes, refs, lifecycle work, and browser integrations.
- **Structs** own dynamic regions of the DOM for conditions, lists, promises, and other multi-node updates.
- **Rendering** mounts a fragment in the browser or renders it to an HTML string on the server.

## Why Nørd?

Nørd is a good fit for applications that benefit from reactive UI without taking on a compiler pipeline or a broad framework runtime. It can be dropped into an existing page, used for independently activated islands, or used to build a complete client application. The focus is a compact, readable API that leaves the browser platform and application architecture in view.

## Performance trade-offs

Nørd is optimized for fine-grained updates: once a fragment exists, a reactive value changes only the DOM location that uses it. There is no component re-run, virtual-DOM diff, or replacement of the surrounding tree.

The complementary trade-off is initial bulk creation. Templates are parsed at runtime rather than compiled ahead of time, so creating a very large number of rows is not Nørd's fastest workload. Updating existing rows surgically is where it performs best.

- [JS Benchmarks results](https://jsbenchmarks.com/) are available now.
- [js-framework-benchmark results](https://krausest.github.io/js-framework-benchmark/) are also available.

Benchmark results vary with the browser, hardware, and methodology. Treat them as workload-specific evidence rather than a universal framework ranking.

## Ecosystem

Nørd's core is deliberately small. Companion packages add focused capabilities without becoming part of the runtime:

- `@grainular/forms` provides reactive controls, validation, bindings, and error rendering.
- `@grainular/router` provides client-side routing, navigation, outlets, hooks, and transitions.
- `@grainular/resource` provides abortable reactive asynchronous resources.
- `@grainular/silo` provides small selector-based stores.
- `@grainular/styled` provides scoped component styles.
- `@grainular/custom-elements` exposes Nørd components as platform custom elements.
- `@grainular/aurora` builds static documentation and content sites with optional independent islands.

These packages have their own APIs and should not be inferred from React, Vue, or other ecosystem conventions. This guide deliberately documents Nørd core and Grains rather than companion-package APIs. Nørd does not currently provide an official i18n package; use the platform `Intl` APIs or an application-level library.

## Examples

These examples are a quick tour, not the whole documentation. The dedicated guides explain each API in detail.

### Hello World

This is all that is required to render a fragment into a page:

```ts title="app.ts"
import { html, mount } from '@grainular/nord';

const App = () => html`Hello World`;

mount(App, { to: document.querySelector('#app') });

// Or, equivalently:
// mount(() => html`Hello World`, { to: document.querySelector('#app') });
```

### Components are just functions

Components return fragments. Passing props and composing components is just calling functions with ordinary objects.

```ts title="app.ts"
import { html } from '@grainular/nord';

const Greeting = ({ name }: { name: string }) => html`<h1>Hej, ${name}!</h1>`;

export const App = () => html`<main>${Greeting({ name: 'Nørd' })}</main>`;
```

[Templates and components](/templates-and-components) covers props, children, and composition.

### Component functions only run once

Nørd evaluates a component when its fragment is created, then maintains the reactive bindings and structs inside that fragment. It does not call the component again for every update.

```ts title="app.ts"
import { html } from '@grainular/nord';

export const App = () => {
    console.log('Created once');
    return html`<p>This fragment can still contain reactive values.</p>`;
};
```

### Grains are not scoped — unless you scope them

State can be local to a component, shared from a module, or passed through props. A grain has no special scope of its own; it updates wherever it is used.

```ts title="counter.ts"
import { grain } from '@grainular/grains';
import { html, on } from '@grainular/nord';

export const count = grain(0);

export const Counter = () => html`
    <button ${on('click', () => count.update((value) => value + 1))}>Count: ${count}</button>
`;
```

[Reactivity and grains](/reactivity) explains local state, shared state, derived values, and other subscribable sources.

### Comments are just HTML comments

Templates use HTML syntax. Nothing special is required for a comment:

```ts title="app.ts"
import { html } from '@grainular/nord';

export const App = () => html`
    <main>
        <!-- Not visible in the DOM. -->
    </main>
`;
```

### Directives access the DOM

Directives are small functions placed on an element. The built-in `on` directive attaches an event listener and cleans it up when the element leaves the document.

```ts title="button.ts"
import { html, on } from '@grainular/nord';

export const Button = () => html` <button ${on('click', () => console.log('Clicked'))}>Click me!</button> `;
```

[Directives](/directives) cover events, attributes, refs, portals, and custom directives.

### Structs handle control flow

Structs manage dynamic regions rather than a property on a single element. `$if` replaces its region when the condition changes.

```ts title="status.ts"
import { grain } from '@grainular/grains';
import { $if, html } from '@grainular/nord';

const isReady = grain(true);

export const Status = () => html`
    ${$if(isReady)
        .$then(() => html`Ready`)
        .$else(() => html`Not ready`)}
`;
```

### Async is not an issue

Promises can have pending, resolved, and error fragments without introducing a separate component type.

```ts title="profile.ts"
import { $await, html } from '@grainular/nord';

const profile = fetch('/api/profile').then((response) => response.json());

export const Profile = () => html`
    ${$await(profile)
        .$then((user) => html`<p>Hej, ${user.name}!</p>`)
        .$pending(() => html`<p>Loading...</p>`)
        .$catch((error) => html`<p>${error.message}</p>`)}
`;
```

### Lists are the final boss

`$each` reconciles a reactive iterable and uses keys to preserve each item’s DOM identity.

```ts title="users.ts"
import { grain } from '@grainular/grains';
import { $each, html } from '@grainular/nord';

const users = grain([
    { id: 'ada', name: 'Ada' },
    { id: 'lin', name: 'Lin' },
]);

export const Users = () => html`
    <ul>
        ${$each(users)
            .$withKey((user) => user.id)
            .$as((user) => html`<li>${user.name}</li>`)}
    </ul>
`;
```

### If Nørd does not have what is needed, build it

`createDirective` and `createStruct` expose the same extension points used by the built-in primitives.

```ts title="color.ts"
import { createDirective, html } from '@grainular/nord';

const color = (value: string) =>
    createDirective((node) => {
        node.style.backgroundColor = value;
    });

export const App = () => html`<p ${color('rebeccapurple')}>Custom directive.</p>`;
```

[Structs](/structs) cover dynamic regions, including lists and asynchronous values. Custom directives and structs each have their own guide.

### Rendering HTML

The same component model can produce static HTML on the server:

```ts title="server.ts"
import { renderToString } from '@grainular/nord';
import { App } from './app';

const html = renderToString(App);
```

[Server rendering](/server-rendering) explains static generation and independent islands.

## Next steps

[Getting started](/getting-started) covers installation and project setup. The following guides expand each concept without requiring a particular application architecture or tooling choice.
