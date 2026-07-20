---
title: Other built-in structs
description: Use Nørd’s lower-level rendering and element structs.
layout: docs
---

# Other built-in structs

Nørd includes focused structs for dynamic rendering and direct HTML integration.

## `$render`

`$render` displays the fragment held by a subscribable and replaces that region whenever the fragment changes. It is useful when the view itself is reactive.

:::Warning{title="The region is replaced, not diffed"}

`$render` disconnects the previous fragment and mounts the next one in its place. It does not compare the two fragments or preserve their DOM nodes. Keep the rendered region small and avoid using it for rapidly changing values; bind those values directly or use a more focused control-flow struct instead.

:::

```ts
import { grain } from '@grainular/grains';
import { $render, html } from '@grainular/nord';

const view = grain(html`<p>Loading…</p>`);

const Screen = () => html`<main>${$render(view)}</main>`;

view.set(html`<p>Ready.</p>`);
```

## `$tag`

`$tag` creates an element programmatically. Use it when the tag name is dynamic or when a small integration needs direct access to the created element. Normal HTML templates remain clearer for ordinary markup.

```ts
import { attr, $tag, html } from '@grainular/nord';

const Action = () => html`${$tag({
    as: 'button',
    children: 'Save',
    use: [attr({ type: 'button' })],
})}`;
```

## `$unsafeHtml`

`$unsafeHtml` inserts a raw HTML string. It does not sanitize its input, so only use it for markup your application fully controls.

```ts
import { $unsafeHtml, html } from '@grainular/nord';

const Article = () => html`${$unsafeHtml('<p>Trusted <strong>HTML</strong>.</p>')}`;
```

:::Caution{title="Never render untrusted HTML"}

`$unsafeHtml` does not sanitize its input. Passing user-authored or otherwise untrusted text to it creates an XSS vulnerability. Sanitize HTML before it reaches this API, or render the source through a safe renderer instead.

:::

## Choosing the right primitive

Use template interpolation for normal content, `$if` and `$each` for control flow, and `$await` for promises. `$render` fits a reactive fragment, `$tag` fits programmatic element creation, and `$unsafeHtml` is the deliberate escape hatch for trusted raw markup.
