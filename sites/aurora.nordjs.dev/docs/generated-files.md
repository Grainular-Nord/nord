---
title: Generated files
description: Understand Aurora search, LLM text, metadata, and 404 output.
layout: docs
links:
    prev:
        text: Styling
        link: /styling
---

# Generated files

Aurora derives supporting files from the Markdown files selected by `content`.

## Sitemap

Set `site.url` to an absolute production URL and Aurora emits `sitemap.xml` during every build.

The sitemap contains every generated content page except `404.html` and pages whose `robots` metadata includes `noindex`. Vite’s configured `base` is included in every public URL.

## Static search

During a build, Aurora reads the generated HTML and creates `aurora-search.json`. The search index contains page titles, sections, anchors, and normalized text.

Search loads the index on demand, ranks matches, and links directly to generated heading IDs. It is available from the development server and in production output.

## LLM text

Every site exposes two plain-text files:

- `llms.txt` contains the site description and a concise route index.
- `llms-full.txt` concatenates all configured Markdown pages in navigation order.

Both files are emitted on every production build without a feature flag.

In addition to the general files, a single index.llms.txt is emitted per page, allowing easy integration and indexing.

:::Tip
If you do not need Llms.txt files, you can disable generation with `config.llms: false` in the aurora config.
:::

## Metadata

Aurora combines global document configuration with Markdown frontmatter, then renders the title, description, robots directives, theme color, and trusted custom head content into each independent HTML document.

- `language`, `themeColor`, and custom head markup come from `aurora.config.ts`.
- `title`, `description`, `robots`, and `layout` come from each Markdown page.

## Custom 404 pages

Place `404.md` beside the `index.md` that resolves to `/`. Aurora uses its content inside the standard page layout and emits `404.html`.

Without that file, Aurora supplies minimal default content. Development and preview servers return the page with a real `404` status for unknown HTML routes.
