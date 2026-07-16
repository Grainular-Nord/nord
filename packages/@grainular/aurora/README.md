# Aurora

Aurora is a Markdown-first static site framework built with Nørd. It emits static HTML and activates only configured client components as independent islands.

An Aurora project needs an `index.md`. Configuration is optional; add `aurora.config.ts` when the site needs more routes, metadata, components, layouts, styles, or Vite options.

```ts
import { defineConfig } from '@grainular/aurora';
import './custom.css';

export default defineConfig({
    navigation: [
        { source: 'index.md', path: '/', label: 'Home' },
        {
            label: 'Guide',
            children: [
                { source: 'guide.md', path: '/guide', label: 'Getting started' },
                { source: 'api.md', path: '/api', label: 'API' },
            ],
        },
    ],
});
```

Navigation is recursive. Groups contain only a label and children; Markdown-backed routes can also contain children when a navigable parent is useful.

Aurora supplies its default theme automatically. Any CSS imported by the config joins the client bundle and can override it.

Every site also exposes `llms.txt`, containing its documentation index, and `llms-full.txt`, containing all configured Markdown pages in navigation order. Both are available during development and emitted during production builds without configuration.

```bash
aurora dev
aurora build
aurora preview
```

Advanced Vite settings can be passed through the config's `vite` property. Aurora retains ownership of its root, custom application mode, and generated build entry.
