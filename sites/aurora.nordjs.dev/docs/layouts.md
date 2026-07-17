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

:::Note
Site navigation, the header, footer, background, and accessibility controls remain available around custom layouts.
:::
