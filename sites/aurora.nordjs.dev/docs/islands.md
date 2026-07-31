---
title: Components and islands
description: Render static Markdown components or activate independent Nørd islands.
layout: docs
lastUpdated: true
links:
    prev:
        text: Markdown
        link: /markdown
    next:
        text: Layouts
        link: /layouts
---

# Components and islands

Aurora uses Nørd components for reusable content and isolated browser behavior. Every component is rendered during static generation. The `client` flag determines what happens after that:

- `client: false` leaves the generated HTML as-is.
- `client: true` emits a dynamic client module and activates that component independently in the browser.

The surrounding Markdown, layout, navigation, and other components remain static. Aurora never needs to turn the page into one large client application.

```ts title="aurora.config.ts"
export default defineConfig({
    components: [
        {
            name: 'Counter',
            client: true,
            component: () => import('./src/components/counter'),
        },
    ],
});
```

The module must provide the component as its default export.

Component modules may live anywhere. `src/components/` is only a useful convention.

## Static components

Use a static component for reusable presentation that does not need events, reactive state, browser APIs, or lifecycle behavior.

```ts title="src/components/version.ts"
import { html } from '@grainular/nord';

type VersionProps = { value: string };

const Version = ({ value }: VersionProps) => html` <span class="version">Current version: ${value}</span> `;

export default Version;
```

Register it with `client: false`:

```ts title="aurora.config.ts"
components: [
    {
        name: 'Version',
        client: false,
        component: () => import('./src/components/version'),
    },
];
```

The component can then be used from any selected Markdown file.

```md
:::Version{value="2.0"}
:::
```

Its output is inserted directly into the generated page. No component host, dynamic browser import, or hydration code is emitted for it.

## Client islands

Use a client island when the component needs interaction or browser-owned state.

```ts title="src/components/counter.ts"
import { grain } from '@grainular/grains';
import { html, on } from '@grainular/nord';

const Counter = () => {
    const count = grain(0);

    return html` <button ${on('click', () => count.update((value) => value + 1))}>Count: ${count}</button> `;
};

export default Counter;
```

Use it from Markdown:

```md
:::Counter
:::
```

Aurora first renders the island’s initial HTML into the static document. In the browser, its dynamically imported module activates only that host. Different islands load and run independently.

Islands can appear inside Markdown, communicate through shared modules, nest inside other islands, and coexist with elements managed outside Nørd.

State stored in component closures is created again in the browser; Aurora does not serialize arbitrary application state. Pass serializable inputs through component props and keep shared client state in imported modules when islands need to communicate.

## Props and children

Directive attributes become component props. Markdown children are passed as a component fragment.

```md
:::Counter{label="Interactive example"}
Optional Markdown children.
:::
```

Numbers and booleans written as directive attributes are converted to their JavaScript equivalents. Other attributes remain strings. Client-island props must be JSON-serializable; Markdown children receive special handling so their generated HTML remains available after activation.

Markdown has no TypeScript boundary, so component prop types document intent but cannot validate authored directives. Keep the public prop surface small and content-oriented.

## Host metadata

Use `host.class` when the island host needs layout styling.

```ts
{
    name: 'Counter',
    client: true,
    component: () => import('./counter'),
    host: { class: 'counter-island' },
}
```

The host class is applied only to client islands because static components render without an Aurora wrapper. Style it from CSS imported by `aurora.config.ts`.

:::Tip
Prefer `client: false` until a component needs browser behavior. The static version is simpler and costs no client JavaScript.
:::
