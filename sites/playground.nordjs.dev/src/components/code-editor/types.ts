import type { CompileDiagnostic } from '../../lib/transpile';

export type CodeEditorProps = { src: string; title?: string };
export type EditorLayout = 'split' | 'stacked';
export type ProjectFile = { path: string; contents: string };
export type PlaygroundDiagnostic = CompileDiagnostic & { path: string };
export type PreviewEvent = { level: 'error' | 'info' | 'log' | 'warn'; message: string };
export type PreviewMessage = { channel: 'nord-playground'; event: PreviewEvent; session: string };
