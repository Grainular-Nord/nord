---
title: Markdown
description: Markdown syntax and content features supported by Aurora.
layout: docs
---

# Markdown

Aurora renders CommonMark, GitHub Flavored Markdown, syntax-highlighted code, and component directives into static HTML. This page documents the supported syntax while exercising the default typography theme.

## Text formatting

Paragraphs support **strong emphasis**, *italic emphasis*, ~~deleted text~~, `inline code`, and [descriptive links](https://nordjs.dev). Bare autolinks such as <https://github.com/grainular-nord/nord> are recognized automatically.

> Good documentation makes the common path obvious and keeps the exceptional path possible.
>
> Blockquotes can contain multiple paragraphs without breaking vertical rhythm.

---

### Heading hierarchy

#### Fourth-level heading

Fourth-level headings work well for named details within a larger section.

##### Fifth-level heading

Fifth- and sixth-level headings remain compact and intentionally avoid competing with page structure.

###### Sixth-level heading

Use deep heading levels sparingly; most pages should remain understandable from their first three levels.

## Lists

- Lists use restrained marker color and consistent spacing.
- A list item can contain nested content:
  - Nested unordered items retain the same rhythm.
  - Long items wrap against the text column rather than against the marker.
- The final item has no artificial trailing space.

1. Ordered lists use tabular markers.
2. They can contain nested steps:
   1. Parse Markdown into an AST.
   2. Transform the document.
   3. Generate static HTML.
3. Rendering order remains clear at narrow widths.

### Task lists

- [x] Parse GitHub Flavored Markdown
- [x] Render static HTML
- [ ] Write the next documentation page

## Tables

Tables remain readable at their natural width and become independently scrollable when the content column is narrower.

| Feature | Generated output | Client JavaScript | Notes |
| --- | --- | ---: | --- |
| Paragraphs and headings | Static HTML | None | Heading IDs are generated during rendering. |
| Syntax highlighting | Static HTML | None | Shiki runs as part of the build pipeline. |
| Component directives | Static HTML or island host | Optional | The component definition controls client activation. |
| Search | Static JSON index | Island only | The index is generated from rendered pages. |

## Code

Inline code such as `renderComponentHost(definition, component, props)` can appear inside prose without changing its line height.

```ts
import { defineConfig } from '@grainular/aurora';

export default defineConfig({
    content: 'docs/*.md',
    navigation: [
        { path: '/', label: 'Overview' },
        { path: '/markdown', label: 'Markdown' },
    ],
});
```

Very long code lines remain horizontally scrollable rather than widening the page:

```ts title="counter.ts" {2-4} blur:true
const counter = grain(0);

const increment = () => counter.set(counter() + 1);
const Counter = () => html`<button ${on('click', increment)}>${counter}</button>`;

const deliberatelyLongIdentifierForResponsiveTesting = 'aurora-keeps-the-document-column-stable-even-when-source-code-is-much-wider-than-the-available-inline-size';
```

Diff fences also communicate additions and removals without extra markup:

```diff title="theme.css"
- --accent: mintcream;
+ --accent: #2997ff;
```

## Images and components

Markdown images are constrained to the content column and preserve their intrinsic aspect ratio.

![The Nørd aurora squircle logo](/logo-aurora-squircle-o.svg)

:::Note
Callouts participate in the same document flow as native Markdown elements.
:::

:::Tip{title="Static by default"}
Callouts render entirely into the generated HTML and require no client JavaScript.
:::

:::Important
Callouts support **inline Markdown**, links, and multiple paragraphs.

- Their content retains normal document rhythm.
- Each variant communicates meaning through more than color alone.

:::

:::Warning
Reserve warning callouts for behavior that could surprise the reader.
:::

:::Caution{title="Potentially destructive"}
Use caution callouts for actions that can cause data loss or cannot be easily reversed.
:::

## Details

:::Details{title="Summary"}
This is text that can be collapsed
:::
