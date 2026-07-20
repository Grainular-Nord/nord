# VS Code extension architecture and scope

## Decision: keep it in the monorepo

The extension remains in `language-tools/nord-vscode` for the current generation.
Its behavior is coupled to Nørd's template syntax, examples in this repository are
its best fixtures, and atomic framework/tooling changes are more valuable than an
independent release pipeline today.

Externalizing becomes worthwhile only when all of these are true:

1. The extension has an independent maintainer or release cadence.
2. Its test suite consumes published Nørd packages rather than workspace source.
3. Cross-repository compatibility is expressed as an explicit support matrix.
4. Separate issue tracking and CI measurably improve ownership.

Until then, a second repository would add synchronization work without creating a
meaningful product boundary.

## Healthy scope

The extension supports four capabilities:

1. Syntax highlighting in canonical `html` tagged templates.
2. Contextual HTML element completion in literal template sections.
3. HTML comment toggling without editing JavaScript interpolations.
4. Folding ranges for complete multiline templates.

The implementation has two layers:

- `src/core` is editor-independent and identifies literal and folding ranges.
- Thin VS Code adapters turn those ranges into completion, comment, and folding
  providers.

The range scanner deliberately has no TypeScript compiler dependency. This keeps
activation fast and the packaged extension small. Its contract is lexical: the
canonical identifier `html` starts a Nørd template; strings, comments, nested
templates, interpolations, and balanced braces are handled without type analysis.

## Explicit non-goals

- Framework API and structural-directive snippets.
- Duplicated documentation for APIs already described by TypeScript types.
- CSS template support; Nørd does not export a canonical `css` tag.
- Diagnostics, formatting, refactors, or a language server.
- Semantic tokens that compete with TypeScript and embedded HTML grammars.
- Import-alias resolution or guessing whether an unrelated `html` function is Nørd.

These features should only be added when a concrete user workflow cannot be served
by VS Code, TypeScript, or a focused provider with a testable boundary.
