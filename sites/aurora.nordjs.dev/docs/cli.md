---
title: CLI and deployment
description: Run Aurora in development, build static output, and preview deployment artifacts.
layout: docs
links:
  prev:
    text: Routing
    link: /routing
  next:
    text: Configuration
    link: /configuration
---

# CLI and deployment

Aurora projects do not need a `vite.config.ts` or `index.html`. Advanced Vite options remain available through `aurora.config.ts`.

## Development

```bash
aurora dev [root] [--host [host]] [--port number] [--open] [--mode mode]
```

The default root is the current directory. The server reloads Markdown pages and restarts when `aurora.config.ts` changes.

## Production build

```bash
aurora build [root] [--mode mode]
```

The build renders every file selected by `content`, bundles activated islands, emits styles and search data, and writes the result to Vite’s output directory—`dist/` by default.

## Preview

```bash
aurora preview [root] [--host [host]] [--port number] [--open] [--mode mode]
```

Preview serves the production output and applies Aurora’s route fallback behavior, including the generated 404 page.

## Deploy

Deploy `dist/` to any static host. Aurora emits ordinary files and requires no server runtime.

- Root routes become `index.html`.
- Nested routes become `path/index.html`.
- A discovered `404.md` becomes `/404.html`.
- Client islands and CSS live beneath Vite’s assets directory.

Set `vite.base` when deploying below a domain subpath. Relative bases are supported for portable output.

:::Tip
Because all page content is static HTML, the deployed site remains readable even if an island script fails or JavaScript is disabled.
:::
