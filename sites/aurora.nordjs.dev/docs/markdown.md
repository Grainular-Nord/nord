---
title: Markdown
description: Author Aurora pages with frontmatter, code fences, callouts, and components.
layout: docs
lastUpdated: true
links:
    prev:
        text: Configuration
        link: /configuration
    next:
        text: Components and islands
        link: /islands
---

# Markdown

Aurora renders Markdown into static HTML during development and production builds. The output does not need a client application to become readable.

Every file selected by `content` is parsed independently. Markdown owns the page body, frontmatter owns page metadata, and the selected layout decides how that body is placed within the site.

## Frontmatter

Page metadata lives at the beginning of a Markdown file.

```yaml
---
title: Components and islands
description: Add static or interactive components to Markdown.
layout: docs
robots: index,follow
links:
    next:
        text: Layouts
        link: /layouts
---
```

Page frontmatter supports:

- `title`, used by the document title and generated LLM index.
- `description`, used for page metadata.
- `robots`, written to the page’s robots meta tag.
- `layout`, selecting a built-in or configured layout.
- `lastUpdated`, displaying this page’s UTC generation time when set to `true`.
- `links.prev` and `links.next`, rendered beneath the built-in docs layout.

Document-wide `language`, `themeColor`, and additional head markup belong in `aurora.config.ts`. `lastUpdated` is a frontmatter-only setting and defaults to `false`.

## Standard Markdown

Aurora supports CommonMark and GitHub Flavored Markdown: headings, emphasis, links, blockquotes, ordered and unordered lists, task lists, tables, autolinks, and strikethrough.

All headings receive stable, deduplicated IDs and permanent links. The default docs layout builds its page outline from level-one through level-three headings in the browser.

Use ordinary Markdown links between pages:

```md
Continue with [Components and islands](/islands).
```

Root-relative links are the clearest option for sites deployed at the domain root. Files in `public/` may be referenced the same way:

```md
![Project logo](/logo.svg)
```

Tables and code blocks remain horizontally scrollable when their contents exceed the document column rather than widening the page.

## Code fences

Shiki highlights code with Aurora’s light and dark syntax themes.

````md
```ts title="counter.ts" {2-3} blur:true
const count = grain(0);
const increment = () => count.update((value) => value + 1);
const Counter = () => html`<button>${count}</button>`;
```
````

- `title` or `filename` names the block.
- `{2-3}` highlights lines or comma-separated ranges.
- `blur:true` softly de-emphasizes lines outside the highlighted range.
- `diff` fences style additions and removals.

The fence language controls syntax highlighting and the short label in the toolbar. When a title is present, the language appears separately. Every enhanced block includes a client-side copy control; the highlighted code itself remains static HTML.

Highlighted lines can focus an explanation on the relevant part of a larger example:

```ts title="counter.ts" {3-4} blur:true
const count = grain(0);

const increment = () => count.update((value) => value + 1);
const Counter = () => html`<button ${on('click', increment)}>${count}</button>`;
```

Use a `diff` fence when documenting a change:

```diff title="theme.css"
- --aurora-accent: mintcream;
+ --aurora-accent: oklch(70% 0.19 255);
```

Ordinary fences still receive highlighting, a language label, and copy behavior without additional metadata:

```bash
aurora build
```

## Code groups

Wrap related fences in `CodeGroup` to present them as tabs. Each fence title becomes its tab label.

````md
:::CodeGroup{label="Install Aurora"}

```bash title="npm"
npm install --save-dev @grainular/aurora
```

```bash title="Bun"
bun add --dev @grainular/aurora
```

:::
````

:::CodeGroup{label="Install Aurora"}

```bash title="npm"
npm install --save-dev @grainular/aurora
```

```bash title="Bun"
bun add --dev @grainular/aurora
```

:::

Code groups use native radio controls and CSS, so switching tabs and keyboard navigation work without JavaScript. The shared Copy action copies the currently selected block.

## Callouts

Aurora registers five static Markdown components by default.

```md
:::Tip{title="Static by default"}
This callout is generated HTML and ships no component JavaScript.
:::
```

Use `Note`, `Tip`, `Important`, `Warning`, or `Caution`. Custom components use the same directive syntax.

Callout bodies are regular Markdown and may contain paragraphs, lists, links, code, and other registered components.

:::Note
Use notes for supplementary context that helps explain the surrounding documentation.
:::

:::Tip{title="Prefer static output"}
Use a client island only when a component needs browser behavior. Everything else can remain generated HTML.
:::

:::Important
Set `site.url` before deployment when the build should include `sitemap.xml`.
:::

:::Warning{title="Keep trusted head markup trusted"}
The global `page.head` value is inserted into every generated document. Do not populate it from untrusted content.
:::

:::Caution
Changing a content file’s path also changes its generated route. Update authored links and sidebar navigation accordingly.
:::

## Details and accordions

`Details` creates a native disclosure element. It remains interactive without client JavaScript and progressively animates with `interpolate-size` where supported.

```md
:::Details{title="Why does this work without JavaScript?"}
Aurora renders a native `<details>` element. The browser owns its interaction.
:::
```

:::Details{title="Why does this work without JavaScript?"}
Aurora renders a native `<details>` element. The browser owns its interaction.
:::

Give related items the same `name` to create an accordion. The browser ensures only one item in the group is open.

```md
:::Details{title="First item" name="example"}
The first item.
:::

:::Details{title="Second item" name="example"}
Opening this item closes the first.
:::
```

:::Details{title="First item" name="aurora-details-example"}
The first item.
:::

:::Details{title="Second item" name="aurora-details-example"}
Opening this item closes the first.
:::
