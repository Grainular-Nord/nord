---
title: Getting started
description: Set up a Nørd project or use Nørd directly in the browser.
layout: docs
links:
  prev:
    text: Overview
    link: /
  next:
    text: Templates and components
    link: /templates-and-components
---

# Getting started

:::Tip
Want to know more about Nørd? Start with the [overview](/).
:::

## Installation

The official scaffolder is the quickest way to start a project. Run one of the following commands and follow the prompts:

:::CodeGroup{label="Create a Nørd project"}
```bash title="npm"
npm create @grainular/nord
```

```bash title="pnpm"
pnpm create @grainular/nord
```

```bash title="Bun"
bun create @grainular/nord
```
:::

The scaffolder selects a project directory and template interactively. The Vite TypeScript template is a sensible default for most applications. The browser template is useful when no package installation or build process is needed.

Vite is only used for development and bundling. Nørd does not need a Vite plugin.

For an existing project, install Nørd and Grains directly:

:::CodeGroup{label="Install manually"}
```bash title="npm"
npm install @grainular/nord @grainular/grains
```

```bash title="pnpm"
pnpm add @grainular/nord @grainular/grains
```

```bash title="Bun"
bun add @grainular/nord @grainular/grains
```
:::

`@grainular/nord` contains the renderer and its core APIs. `@grainular/grains` provides the reactive values used throughout this guide. Grains is optional: Nørd can work with any compatible subscribable value.

## Using Nørd from a CDN

Nørd also works without a package manager or build step. Its ESM bundle can be imported from a CDN in an ordinary HTML file:

```html title="index.html"
<!doctype html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>My Nørd application</title>
    </head>
    <body>
        <main id="app"></main>

        <script type="module">
            import { html, mount, on } from 'https://unpkg.com/@grainular/nord/dist/esm/index.js';
            import { grain } from 'https://unpkg.com/@grainular/grains/dist/esm/index.js';

            const count = grain(0);
            const App = () => html`
                <button ${on('click', () => count.update((value) => value + 1))}>
                    Count: ${count}
                </button>
            `;

            mount(App, { to: document.querySelector('#app') });
        </script>
    </body>
</html>
```

These are native browser modules, so they do not add anything to the global scope. Serve the file with any static HTTP server and open it in a modern browser. Code running directly in the browser must remain regular JavaScript; TypeScript-only syntax is not supported there.

## Project setup

The Vite TypeScript template starts with a small project structure:

```text
my-app/
├── index.html
├── package.json
├── vite.config.ts
└── src/
    ├── app.ts
    ├── app.css
    ├── main.ts
    └── style.css
```

`index.html` contains the application root, `main.ts` mounts the application, and `app.ts` contains the first component. This is a starting point rather than a required convention; components, state, directives, and styles can follow the structure of the application.

Start the development server with the command for the selected package manager:

:::CodeGroup{label="Run the project"}
```bash title="npm"
npm run dev
```

```bash title="pnpm"
pnpm dev
```

```bash title="Bun"
bun run dev
```
:::

Use the matching `build` command to create production assets and `preview` to inspect them locally. These commands belong to Vite; Nørd itself does not add another build layer.

## Next steps

With the project set up, continue with [Templates and components](/templates-and-components). [Reactivity and grains](/reactivity) introduces reactive state, [Directives](/directives) cover element behavior, and [Structs](/structs) handle dynamic regions.
