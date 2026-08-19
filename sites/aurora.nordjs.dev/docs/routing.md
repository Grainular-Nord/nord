---
title: Routing
description: Generate routes from Markdown paths and configure sidebar links independently.
layout: docs
lastUpdated: true
links:
    prev:
        text: Getting started
        link: /getting-started
    next:
        text: CLI and deployment
        link: /cli
---

# Routing

Aurora generates pages from the Markdown files matched by `content`.

```ts title="aurora.config.ts"
export default defineConfig({
    content: 'docs/**/*.md',
});
```

Markdown may live anywhere beneath the project root. A `docs/` directory is a convention, not a requirement.

Routes are relative to the static directory before the glob:

| Markdown file           | Route            |
| ----------------------- | ---------------- |
| `docs/index.md`         | `/`              |
| `docs/about.md`         | `/about`         |
| `docs/guide/index.md`   | `/guide`         |
| `docs/guide/install.md` | `/guide/install` |

The content tree must contain an `index.md` that resolves to `/`. Aurora looks for `404.md` beside that file and emits it separately as `/404.html`.

`content` can also be an array. The patterns form one content tree relative to their common directory.

```ts
content: ['docs/*.md', 'docs/guides/**/*.md'];
```

## Sidebar navigation

`navigation` defines links and groups rendered in the documentation sidebar. It does not generate routes or read Markdown files. Top-level groups are collapsible, while nested items may recurse to any depth.

```ts title="aurora.config.ts"
export default defineConfig({
    content: 'docs/**/*.md',
    navigation: [
        {
            label: 'Guide',
            children: [
                { path: '/guide', label: 'Overview' },
                { path: '/guide/install', label: 'Installation' },
            ],
        },
    ],
});
```

A page can exist without appearing in navigation, and a navigation entry can link to any authored site path.

### Route-specific sidebars

Add `root` to top-level navigation items when different sections of a site need different sidebar views. Items sharing a root are rendered together whenever the current route is at or below that root.

```ts title="aurora.config.ts"
export default defineConfig({
    content: 'docs/**/*.md',
    navigation: [
        {
            root: '/',
            label: 'Guide',
            children: [
                { path: '/', label: 'Overview' },
                { path: '/getting-started', label: 'Getting started' },
            ],
        },
        {
            root: '/',
            path: '/ecosystem',
            label: 'Ecosystem',
        },
        {
            root: '/ecosystem',
            path: '/ecosystem/resource',
            label: 'Resource',
        },
        {
            root: '/ecosystem',
            path: '/ecosystem/router',
            label: 'Router',
        },
    ],
});
```

The standard routes render both entries rooted at `/`. Visiting `/ecosystem` or any nested route instead renders the Resource and Router entries rooted at `/ecosystem`.

When multiple roots match, Aurora selects the most specific one. For example, `/ecosystem/router/hooks` prefers `/ecosystem/router` over `/ecosystem` and `/`. Root matching follows complete path segments, so `/api` does not match `/apix`.

If the current route does not match any configured root, Aurora renders the complete navigation. Configurations without `root` therefore retain the default behavior.

## Site links

Write root-relative links in Markdown and configuration:

```md
Read the [islands guide](/islands).
```

Aurora resolves configured UI links against Vite’s `base`. Markdown links are rendered as authored, making root-relative paths the clearest default for root deployments.

## Link validation

Production builds fail when an internal page or heading link has no generated target. Aurora checks links from Markdown, navigation, and page controls after rendering, including relative paths and fragments. External URLs and links to files are left alone.
