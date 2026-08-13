---
title: Server rendering
description: Generate static HTML with Nørd and activate independent client applications.
layout: docs
lastUpdated: true
links:
    prev:
        text: Creating structs
        link: /structs/custom
    next:
        text: Tooling
        link: /tooling
---

# Server rendering

Nørd can turn the same component fragments used in the browser into HTML on the server. It does not prescribe a server, router, or deployment model; rendering HTML is a small function call you can use in a static build, an HTTP handler, or a larger application.

## `renderToString`

`renderToString` evaluates a component and returns its current HTML snapshot.

```ts title="page.ts"
import { html, renderToString } from '@grainular/nord';

const Page = () => html`<main><h1>Hello from Nørd</h1></main>`;

const page = renderToString(Page);
// <main><h1>Hello from Nørd</h1></main>
```

Nørd does not add a document shell. Put the result into the HTML document your server or build process already creates.

```ts title="document.ts"
const document = `<!doctype html>
<html lang="en">
    <head><title>Example</title></head>
    <body>${renderToString(Page)}</body>
</html>`;
```

:::Caution
`renderToString` escapes interpolated values during serialization, but cannot guarantee that malicious JavaScript is stripped. If you include user generated values in serialization, make sure to sanitize them accordingly.
:::

## Static generation

Static generation is the natural use of server rendering: evaluate each route during a build, then write the resulting document to the output directory. The browser receives ordinary HTML that works before JavaScript loads.

Aurora uses this model for documentation pages, but Nørd itself has no dependency on Aurora. Any build tool, server runtime, or file writer can call `renderToString`.

## Client activation

`mount` activates a browser application by creating a fresh DOM fragment, connecting its reactive bindings, then replacing the target's existing children in one operation.

```ts title="client.ts"
import { mount } from '@grainular/nord';
import { Counter } from './counter';

mount(Counter, { to: document.querySelector('#counter') });
```

This is deliberately destructive hydration. Nørd does not walk server-rendered DOM to recover component state; it mounts a live application quickly and swaps its target region once it is ready.

## Island architecture

Render the static page normally, then reserve small, independent hosts for the parts that require a browser. Each island can load and mount independently.

```html title="page.html"
<article>
    <h1>Mostly static content</h1>
    <div id="newsletter-signup"></div>
    <div id="counter"></div>
</article>
```

```ts title="islands.ts"
import { mount } from '@grainular/nord';
import { Counter } from './counter';
import { NewsletterSignup } from './newsletter-signup';

mount(NewsletterSignup, { to: document.querySelector('#newsletter-signup') });
mount(Counter, { to: document.querySelector('#counter') });
```

Islands do not need a shared application root. They can communicate through ordinary shared modules, browser APIs, or the state layer you already use. An island may also live inside another Nørd application when that composition is useful.

## State and serialization

Component state lives in JavaScript closures. It is not serialised into the HTML snapshot and cannot be reconstructed by reading it back from the DOM. A client mount therefore starts with its own state.

For static pages and self-contained islands, this is usually the simplest model. When the browser needs data from the server, provide it explicitly: embed a small JSON payload, fetch an endpoint, or use the page URL and browser storage as appropriate for the application.

## When not to hydrate

Do not mount an application merely because a page was rendered on the server. Static content, navigation links, articles, and ordinary forms already work as HTML. Mount only the controls that need reactive state or browser APIs.

Nørd is particularly effective when server rendering provides the page and small islands add interaction. It is not designed for incremental DOM hydration or for recovering a large application tree from a server snapshot.
