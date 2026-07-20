export { EditorFileTree, EditorStatusBar, EditorToolbar } from './components/chrome';
/**
 * Public entry point for the Nørd CodeMirror workspace.
 *
 * - `createNordEditorEngine` owns project and preview state.
 * - `NordEditor` is the complete default composition.
 * - `EditorWorkspace` and the smaller component exports support custom UI.
 * - `theme.css` supplies the matching default CSS without prescribing a host theme.
 */
export { CodeMirrorEditor } from './components/code-mirror';
export { NordEditor } from './components/nord-editor';
export { PreviewPanel } from './components/preview-panel';
export { EditorProjectTree } from './components/project-tree';
export { EditorResizeHandle } from './components/resize-handle';
export { default, EditorWorkspace } from './components/workspace';
export { downloadProject, projectZip } from './core/download';
export { createNordEditorEngine, type NordEditorEngine, type NordEditorEngineOptions } from './core/engine';
export { cloneProject, createEditorProject } from './core/project';
export { deserializeProject, projectFromLocation, projectShareUrl, serializeProject } from './core/share';
export type {
    EditorDiagnostic,
    EditorFile,
    EditorLayout,
    EditorPreviewEvent,
    EditorPreviewMessage,
    EditorProjectSource,
    EditorTheme,
    EditorTool,
    EditorToolDefinition,
    EditorWorkspaceSlots,
} from './core/types';
export { type ResizeAxis, resizable } from './directives/resizable.directive';
export { buildPreviewDocument } from './preview/nord-preview';
export { type CompileDiagnostic, getCompileDiagnostics, stripTypes } from './preview/transpile';
