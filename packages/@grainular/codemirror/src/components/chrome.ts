// Lightweight, replaceable editor chrome primitives.
import type { ComponentFragment } from '@grainular/nord';
import { html } from '@grainular/nord';

/** Minimal toolbar primitive for a custom `EditorWorkspace` composition. */
export const EditorToolbar = ({ end, start }: { end?: ComponentFragment; start?: ComponentFragment }) =>
    html`<header data-grainular-editor="toolbar"><div data-grainular-editor="toolbar-start">${start}</div><div data-grainular-editor="toolbar-end">${end}</div></header>`;

/** Minimal file-tree shell for a custom composition. */
export const EditorFileTree = ({
    actions,
    children,
    title = 'Files',
}: {
    actions?: ComponentFragment;
    children: ComponentFragment;
    title?: string;
}) =>
    html`<aside data-grainular-editor="file-tree"><header><span>${title}</span>${actions}</header>${children}</aside>`;

/** Minimal status-bar primitive for a custom composition. */
export const EditorStatusBar = ({ children }: { children?: ComponentFragment }) =>
    html`<footer data-grainular-editor="status">${children}</footer>`;
