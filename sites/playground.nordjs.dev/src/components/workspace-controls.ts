import { html } from '@grainular/nord';
import { resizable } from '../directives/resizable.directive';
import './workspace-controls.css';

const limits = (workspace: HTMLElement) => ({
    max: workspace.clientWidth * 0.72,
    min: Math.min(25 * 16, workspace.clientWidth * 0.48),
});

export const WorkspaceControls = () => {
    const resize = resizable({
        axis: () => 'inline',
        bounds: (workspace) => limits(workspace),
        container: (handle) => handle.closest<HTMLElement>('.lesson-layout'),
        resize: (workspace, _axis, size) => workspace.style.setProperty('--lesson-pane-size', `${size}px`),
    });

    return html`
        <div class="lesson-workspace-controls">
            <div
                class="lesson-resize-handle"
                role="separator"
                aria-label="Resize lesson and editor"
                aria-orientation="vertical"
                tabindex="0"
                ${resize}
            ></div>
        </div>
    `;
};

export default WorkspaceControls;
