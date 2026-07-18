import { derived, type Grain } from '@grainular/grains';
import { html } from '@grainular/nord';
import { type ResizeAxis, resizable } from '../../directives/resizable.directive';
import type { EditorLayout } from './types';

const axisFor = (layout: EditorLayout, workspace: HTMLElement): ResizeAxis =>
    layout === 'split' && workspace.clientWidth >= 42 * 16 ? 'inline' : 'block';

export const ResizeHandle = ({ layout }: { layout: Grain<EditorLayout> }) => {
    const orientation = derived(layout, (value) => (value === 'split' ? 'vertical' : 'horizontal'));
    const resize = resizable({
        axis: (workspace) => axisFor(layout(), workspace),
        bounds: (workspace, axis) => {
            const total = axis === 'inline' ? workspace.clientWidth : workspace.clientHeight;
            return { min: Math.min(16 * 16, total * 0.45), max: total * 0.72 };
        },
        container: (handle) => handle.parentElement,
        resize: (workspace, axis, size) =>
            workspace.style.setProperty(
                axis === 'inline' ? '--editor-split-size' : '--editor-stacked-size',
                `${size}px`,
            ),
    });

    return html`<div class="aurora-code-editor-resize-handle" role="separator" aria-label="Resize editor and preview" aria-orientation="${orientation}" tabindex="0" ${resize}></div>`;
};
