# Nord for VS Code

Official VS Code language tools for **Nørd**. This extension provides a rich development experience with syntax highlighting and intelligent suggestions.

## Features

### Syntax Highlighting

Get full HTML and CSS syntax highlighting inside Nord's tagged templates.

```ts
// HTML highlighting works automatically
const template = html`
  <div class="container">
    <h1>Hello World</h1>
  </div>
`;

// CSS highlighting
const style = css`
  .container { color: red; }
`;

```

### Intelligent Suggestions

Speeds up development with context-aware suggestions.

- **HTML Tags**: Smart completion for standard HTML5 tags (div, span, input, etc.).
- **Structural Directives**: Type $ to instantly access control flow:
- **Element Directives**

## Usage

1. Install the extension.
2. Open any .ts or .js file using Nord.
3. Type "html" followed by a backtick to see highlighting in action.

## Extension Settings

This extension currently requires no configuration. It activates automatically on JavaScript and TypeScript files.

## Contributing

Found a bug or have a feature request? Please open an issue on our GitHub Repository.
