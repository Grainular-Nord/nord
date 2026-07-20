---
title: Layouts
description: Compose generated page content with built-in or custom Aurora layouts.
layout: docs
links:
  prev:
    text: Components and islands
    link: /islands
  next:
    text: Styling
    link: /styling
---

# Layouts

Layouts arrange Markdown content within the surrounding site.

Aurora includes two layouts:

- `page` renders a centered content page without documentation navigation.
- `docs` adds the recursive sidebar and page outline.

Select one through Markdown frontmatter.

```yaml
---
layout: docs
---
```

## Create a layout

Layout modules may live anywhere. `src/layouts/` is only a useful convention.

```ts title="src/layouts/landing.ts"
import type { AuroraLayoutProps } from '@grainular/aurora';
import { html } from '@grainular/nord';

const Landing = ({ content, meta }: AuroraLayoutProps) => html`
    <main class="landing" aria-label="${meta.title}">
        ${content}
    </main>
`;

export default Landing;
```

Register the module by name:

```ts title="aurora.config.ts"
export default defineConfig({
    layouts: [
        {
            name: 'landing',
            layout: () => import('./src/layouts/landing'),
        },
    ],
});
```

Layouts arrange the content region of a page. Interactive components rendered within that content continue to behave as independent islands.

## Slots

A layout may expose named regions, called slots, that a site can fill without rewriting the layout. A slot is defined exactly like a component — `client` chooses static or activated behavior, and `component` lazily loads its default export.

The built-in `docs` layout exposes:

- `search` — rendered above the sidebar navigation. Defaults to Aurora's search island.
- `sidebar` — the navigation tree. Defaults to `Navigation`.
- `beforeContent` — rendered above the Markdown content. Empty by default.
- `pageLinks` — rendered below the content. Defaults to the previous and next links from frontmatter.
- `outline` — the page outline. Defaults to Aurora's outline island.
- `beforeFooter` — rendered after the layout, before the site footer. Empty by default.

Overriding a slot on a built-in layout means re-registering that layout's name with its own render function, then attaching `slots`:

```ts title="aurora.config.ts"
import { defineConfig } from '@grainular/aurora';
import { Docs } from '@grainular/aurora/runtime';

export default defineConfig({
    layouts: [
        {
            name: 'docs',
            layout: async () => ({ default: Docs }),
            slots: {
                sidebar: {
                    client: true,
                    component: () => import('./src/components/custom-sidebar'),
                },
            },
        },
    ],
});
```

A slot without an override falls back to the layout's default, so a config may override only the slots it needs.

Slots are not specific to `docs`. Any layout, built-in or custom, can read `slots` from its props and decide what to expose:

```ts title="src/layouts/landing.ts"
import type { AuroraLayoutProps } from '@grainular/aurora';
import { html } from '@grainular/nord';

const Landing = ({ content, meta, slots }: AuroraLayoutProps) => html`
    <main class="landing" aria-label="${meta.title}">
        ${slots?.hero?.({}) ?? null}
        ${content}
    </main>
`;

export default Landing;
```

```ts title="aurora.config.ts"
layouts: [
    {
        name: 'landing',
        layout: () => import('./src/layouts/landing'),
        slots: {
            hero: {
                client: false,
                component: () => import('./src/components/landing-hero-override'),
            },
        },
    },
],
```

## Header and footer

The header and footer are not part of any layout — they wrap every page, regardless of which layout it selects — so they are overridden through a top-level `slots` field instead of a layout's own `slots`.

```ts title="aurora.config.ts"
export default defineConfig({
    slots: {
        header: {
            client: false,
            component: () => import('./src/components/custom-header'),
        },
    },
});
```

See [Components and islands](/islands) for `client`, `component`, and `host`, which slots share with every other component definition.

:::Note
Site navigation, background, and accessibility controls remain available around custom layouts. The header and footer remain available too, unless overridden through `slots`.
:::
