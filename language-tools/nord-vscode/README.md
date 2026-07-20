# Nord for VS Code

Focused VS Code language support for Nørd's `html` tagged templates.

## Features

- HTML syntax highlighting in JavaScript, TypeScript, JSX, and TSX files.
- HTML element completion after typing `<` and automatic closing tags after `>`.
- Folding for complete multiline `html` templates, including nested templates.
- HTML comment insertion and removal inside literal template sections.

Use **Nord: Toggle HTML Comment** from the command palette or the normal
<kbd>Cmd</kbd>+<kbd>/</kbd> / <kbd>Ctrl</kbd>+<kbd>/</kbd> shortcut. Outside a
Nord HTML template, the shortcut falls back to VS Code's normal line comment.

To confirm activation, open VS Code's **Output** panel and select **Nord**. The
extension writes one activation entry containing its version and otherwise stays
quiet during normal editing.

```ts
import { html } from '@grainular/nord';

const Greeting = (name: string) => html`
    <section>
        <h1>Hello ${name}</h1>
    </section>
`;
```

The extension intentionally recognizes the canonical `html` tag. Aliased imports
are regular JavaScript but cannot be identified by the TextMate grammar and are
therefore outside the supported syntax.

## Scope

The extension owns editor behavior specific to the boundary between JavaScript
and Nørd HTML templates. TypeScript already owns completion and diagnostics inside
`${...}` expressions, while VS Code owns general JavaScript and TypeScript editing.

The extension does not provide framework API snippets, directive documentation,
CSS templates, formatting, linting, diagnostics, or a language server. See
[Architecture and scope](./docs/architecture.md) for the rationale.

## Development

```sh
bun run test
bun run typecheck
bun run build
bun run package
```
