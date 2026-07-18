import { derived, type Grain } from '@grainular/grains';
import { html } from '@grainular/nord';
import type { EditorLayout } from '../core/types';
import { type ResizeAxis, resizable } from '../directives/resizable.directive';

const axisFor = (layout: EditorLayout, workspace: HTMLElement): ResizeAxis =>
    layout === 'split' && workspace.clientWidth >= 42 * 16 ? 'inline' : 'block';

/** Space actually shared by the editor and preview panes: the sidebar column never shrinks. */
const availableSize = (workspace: HTMLElement, axis: ResizeAxis) => {
    if (axis !== 'inline') return workspace.clientHeight;
    const tree = workspace.querySelector('[data-grainular-editor="project-tree"]');
    return workspace.clientWidth - (tree instanceof HTMLElement ? tree.offsetWidth : 0);
};

/**
 * Default split-pane separator. Its measurement uses the adjacent editor pane
 * rather than the whole workspace, so the file-tree width never causes a jump.
 */
export const EditorResizeHandle = ({ layout }: { layout: Grain<EditorLayout> }) => {
    const orientation = derived(layout, (value) => (value === 'split' ? 'vertical' : 'horizontal'));
    const resize = resizable({
        axis: (workspace) => axisFor(layout(), workspace),
        bounds: (workspace, axis) => {
            const total = availableSize(workspace, axis);
            return { min: Math.min(16 * 16, total * 0.45), max: total * 0.72 };
        },
        container: (handle) => handle.parentElement,
        measure: (handle, _workspace, axis) => {
            const editor = handle.previousElementSibling;
            if (!(editor instanceof HTMLElement)) return 0;
            const bounds = editor.getBoundingClientRect();
            return axis === 'inline' ? bounds.width : bounds.height;
        },
        resize: (workspace, axis, size) =>
            workspace.style.setProperty(
                axis === 'inline' ? '--editor-split-size' : '--editor-stacked-size',
                `${size}px`,
            ),
    });

    return html`<div
    data-grainular-editor="resize-handle"
    role="separator"
    aria-label="Resize editor and preview"
    aria-orientation="${orientation}"
    tabindex="0"
    ${resize}
  ></div>`;
};
