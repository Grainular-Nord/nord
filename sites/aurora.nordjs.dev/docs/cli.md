---
title: CLI and deployment
description: Run Aurora in development, build static output, and preview deployment artifacts.
layout: docs
lastUpdated: true
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

## Programmatic API

The CLI commands are also available from the package entry point:

```ts
import { build, dev, preview } from '@grainular/aurora';

const development = await dev({ root: './docs', port: 3000 });
await development.close();

await build({ root: './docs', mode: 'production' });

const production = await preview({ root: './docs', port: 4173 });
await production.close();
```

`dev` returns a handle whose `server` property always points to the active Vite server, including after Aurora restarts it for a config change. `build` resolves when the production output is complete, and `preview` returns Vite’s preview server.

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
