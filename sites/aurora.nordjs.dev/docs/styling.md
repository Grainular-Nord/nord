---
title: Styling
description: Extend Aurora’s default theme with ordinary imported CSS.
layout: docs
links:
  prev:
    text: Layouts
    link: /layouts
  next:
    text: Generated files
    link: /generated-files
---

# Styling

Aurora automatically includes its default theme. Import CSS from `aurora.config.ts` to extend or override it.

```ts title="aurora.config.ts"
import { defineConfig } from '@grainular/aurora';
import './custom.css';

export default defineConfig({});
```

Imported styles are bundled with the site. Theme customization uses ordinary CSS rather than an Aurora-specific theme object.

## Cascade layers

The default stylesheet declares these layers in order:

```css
@layer aurora.tokens, aurora.base, aurora.content, aurora.components, aurora.overrides;
```

Place site-specific rules in the final layer.

```css title="custom.css"
@layer aurora.overrides {
    :root {
        --aurora-accent: oklch(70% 0.19 255);
        --aurora-font-body: Inter, system-ui, sans-serif;
    }

    .landing {
        inline-size: min(100% - 2rem, 72rem);
        margin-inline: auto;
    }
}
```

## Theme tokens

The stable customization surface is the `--aurora-*` token set in the default theme. It covers typography, layout widths, radii, surfaces, borders, text, accents, and code backgrounds.

Light and dark tokens are selected through `html[data-theme]`. The selected theme is applied before the first paint.

## Syntax tokens

Shiki emits semantic CSS variables rather than fixed colors. Override them alongside the rest of the theme.

```css
@layer aurora.overrides {
    html[data-theme="dark"] {
        --aurora-syntax-foreground: var(--aurora-text);
        --aurora-syntax-token-keyword: deepskyblue;
        --aurora-syntax-token-string: palegreen;
        --aurora-syntax-token-function: turquoise;
        --aurora-syntax-token-constant: violet;
        --aurora-syntax-token-comment: var(--aurora-text-faint);
    }
}
```

Additional tokens cover punctuation, parameters, string expressions, links, and inserted or deleted diff lines.

## Component customization

Aurora’s public elements use `aurora-*` classes. Override those classes in `aurora.overrides`, or style custom Markdown components with application-owned class names.
