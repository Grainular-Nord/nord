---
title: Configuration
description: Configure site metadata, routes, components, layouts, Markdown, and Vite.
layout: docs
links:
  prev:
    text: CLI and deployment
    link: /cli
  next:
    text: Markdown
    link: /markdown
---

# Configuration

`aurora.config.ts` is an optional TypeScript module defining routes, shared document settings, site chrome, Markdown components, layouts, and optional Vite settings. It can import ordinary TypeScript modules and CSS directly.

Without a config file, Aurora uses `index.md` as the site root, applies the default theme, and generates a single page. Add configuration only when the site needs more content, navigation, metadata, components, layouts, or Vite behavior.

`defineConfig` returns the object unchanged. Its purpose is type checking and editor completion, so values may be composed with normal TypeScript before they are passed to Aurora.

```ts title="aurora.config.ts"
import { defineConfig } from '@grainular/aurora';
import './custom.css';

export default defineConfig({
    content: 'docs/*.md',
    navigation: [
        { path: '/guide', label: 'Guide' },
    ],
    page: {
        language: 'en',
        themeColor: '#090d13',
    },
    site: {
        url: 'https://example.com',
        title: 'My site',
        description: 'A concise site description.',
        image: '/social-preview.png',
        logo: '/logo.svg',
        navigation: [{ text: 'Guide', link: '/guide' }],
        social: [
            { label: 'GitHub', link: 'https://github.com/example/project', icon: 'github' },
        ],
        footer: 'Built with Aurora.',
    },
});
```

## Site configuration

`site` supplies shared UI and metadata defaults:

- `url` is the absolute production URL used to generate `sitemap.xml`.
- `title` and `description` identify the site.
- `image` supplies the global Open Graph and social preview image.
- `logo` points to a public asset.
- `navigation` renders links in the fixed header.
- `social` renders labelled icon links.
- `footer` accepts text, structured links, a Nørd fragment, or `false`.

Files in `public/` are copied by Vite and addressed from the site root. A configured asset such as `logo: '/logo.svg'` belongs there.

Aurora resolves `image` against `url` and Vite’s public base, then emits absolute Open Graph and Twitter-card metadata for every page.

Header and footer links use `{ text, link }`. Root-relative links are resolved against Vite’s configured `base`, while external and relative links are left unchanged.

```ts
site: {
    footer: {
        text: 'Released under the MIT License.',
        navigation: [
            { text: 'GitHub', link: 'https://github.com/example/project' },
            { text: 'Getting started', link: '/getting-started' },
        ],
    },
}
```

## Document configuration

`page` contains settings shared by every generated document.

```ts
page: {
    language: 'en',
    themeColor: '#090d13',
    head: '<meta name="generator" content="Aurora" />',
}
```

`language`, `themeColor`, and `head` are global-only. `head` is trusted markup; use it only with content controlled by the application.

Page-specific `title`, `description`, `robots`, `layout`, and previous or next links belong in Markdown frontmatter.

```yaml
---
title: Configuration
layout: docs
links:
  prev:
    text: Getting started
    link: /getting-started
  next:
    text: Markdown
    link: /markdown
---
```

Aurora combines the page title with `site.title` for the document `<title>`. A page description overrides the shared site description. The built-in `docs` layout renders configured previous and next links beneath the page content; either direction may be omitted.

## Content and routing

`content` accepts a Markdown glob or an array of globs. Every matched file becomes a page, with its route inferred from its path.

```ts
content: 'docs/**/*.md'
```

The content tree must contain an `index.md` that resolves to `/`.

`navigation` is an independent list of sidebar links. It does not discover or generate pages.

```ts
navigation: [
    {
        label: 'Guide',
        children: [
            { path: '/start', label: 'Getting started' },
        ],
    },
]
```

Top-level navigation groups are collapsible. Children may contain further links or groups without a fixed nesting limit. Navigation paths do not need to correspond to Markdown sources, allowing links to generated pages or other site locations.

See [Routing](/routing) for path inference, recursive sidebar groups, and site links.

## Components and layouts

Each component or layout points to a module with a default export. Components use `client` to choose static HTML or browser behavior; layouts are selected from Markdown frontmatter.

```ts
components: [
    {
        name: 'Counter',
        client: true,
        component: () => import('./src/components/counter'),
    },
],
layouts: [
    {
        name: 'landing',
        layout: () => import('./src/layouts/landing'),
    },
],
```

Dynamic imports keep configuration declarative and allow Vite to separate client islands into their own chunks. Static components are still loaded during generation, but their modules are not activated in the browser.

Names are the public identifiers used by Markdown:

```md
:::Counter
:::
```

See [Components and islands](/islands) and [Layouts](/layouts) for complete examples.

## Advanced Markdown

Additional rehype-compatible plugins and source transforms can customize Markdown output.

```ts
export default defineConfig({
    markdown: {
        plugins: [[myRehypePlugin, { option: true }]],
        transforms: [(source) => source.replaceAll(':wave:', '👋')],
    },
});
```

Transforms receive the Markdown source before parsing and return the source Aurora should process. Plugins operate on the generated syntax tree after Aurora’s heading and syntax-highlighting behavior has been configured.

Prefer components for reusable interface elements and plugins for document-wide structural changes.

## Vite passthrough

Use `vite` for options Aurora does not own.

```ts
export default defineConfig({
    vite: {
        base: '/docs/',
        resolve: {
            alias: { '@': new URL('./src', import.meta.url).pathname },
        },
    },
});
```

Common uses include deployment bases, aliases, development-server options, and additional Vite plugins. Aurora supplies its own application entry and static generation pipeline; the passthrough is intended to extend those defaults rather than replace them.
