---
title: Tooling
description: Editors, formatting, debugging, and browser tools for Nørd projects.
layout: docs
---

# Tooling

Nørd does not require a compiler plugin, a custom browser runtime, or proprietary developer tools. Its templates are ordinary tagged template literals and components are ordinary TypeScript functions, so established editor, debugger, and browser tooling remains useful.

## Editors

### VS Code

Install [Nørd for VS Code](https://marketplace.visualstudio.com/items?itemName=iamsebastiandev.grainular-nord-vscode) for HTML highlighting, element completion, HTML comments, and folding in Nørd templates.

### Zed

[Zed](https://zed.dev/) supports tagged templates in its built-in language tooling, so it works well with Nørd templates without an additional extension.

## Formatting

Both [Prettier](https://prettier.io/) and [Oxfmt](https://oxc.rs/docs/guide/usage/formatter) format Nørd templates. Oxfmt now formats the embedded HTML in tagged templates as well as the surrounding TypeScript, so it is a supported formatter for Nørd projects.

## Debugging

Nørd does not need a dedicated browser-devtools extension. Use your browser's regular developer tools to inspect the rendered DOM, styles, events, network activity, and performance. Nørd renders standard DOM nodes, so the Elements panel shows the same nodes the browser is operating on.

Use the editor or browser debugger for breakpoints in components, directives, event handlers, and callbacks. A regular `debugger` statement works too:

```ts title="counter.ts"
import { html, on } from '@grainular/nord';

export const Counter = () => {
    const increment = () => {
        debugger;
        // Inspect local values and step through ordinary TypeScript here.
    };

    return html`<button ${on('click', increment)}>Increment</button>`;
};
```

When a problem involves state updates, start by placing a breakpoint where the value changes or where its callback runs. When it involves rendering, inspect the resulting DOM in the Elements panel. This is usually more direct than switching to framework-specific tools.
