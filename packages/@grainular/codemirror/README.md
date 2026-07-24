# @grainular/codemirror

A browser-first, Nørd-native CodeMirror workspace. It provides project state,
theme and slot contracts, portable project sharing, and project downloads. The
host supplies framework-specific preview and runtime behaviour.

## Project utilities

```ts
import { createEditorProject, downloadProject, projectShareUrl } from '@grainular/codemirror';

const project = createEditorProject([{ path: 'main.ts', contents: 'export {};' }]);

const shareUrl = projectShareUrl({ files: project.files() });
downloadProject(project.files(), 'my-app');
```

## Workspace slots

`EditorWorkspace` provides stable structural regions for a host theme:
`toolbarStart`, `toolbarEnd`, `sidebar`, `panel`, and `status`. The regions are
marked with `data-grainular-editor` attributes so a host can style the complete
workspace without coupling its CSS to CodeMirror's generated class names.
