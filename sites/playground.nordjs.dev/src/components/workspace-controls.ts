import { html, mounted } from '@grainular/nord';
import './workspace-controls.css';

const limits = (workspace: HTMLElement) => ({
    max: workspace.clientWidth * 0.72,
    min: Math.min(25 * 16, workspace.clientWidth * 0.48),
});

export const WorkspaceControls = () => {
    const resize = mounted((handle) => {
        const workspace = handle.closest<HTMLElement>('.lesson-layout');
        if (!workspace) return;

        let origin = 0;
        let size = 0;

        const currentSize = () => {
            const bounds = workspace.getBoundingClientRect();
            const handleBounds = handle.getBoundingClientRect();
            return handleBounds.left + handleBounds.width / 2 - bounds.left;
        };

        const update = (next: number) => {
            const { min, max } = limits(workspace);
            const value = Math.min(Math.max(next, min), max);
            workspace.style.setProperty('--lesson-pane-size', `${value}px`);
            handle.setAttribute('aria-valuemin', `${Math.round(min)}`);
            handle.setAttribute('aria-valuemax', `${Math.round(max)}`);
            handle.setAttribute('aria-valuenow', `${Math.round(value)}`);
        };

        const start = (event: PointerEvent) => {
            origin = event.clientX;
            size = currentSize();
            update(size);
            handle.setPointerCapture(event.pointerId);
        };

        const move = (event: PointerEvent) => {
            if (!handle.hasPointerCapture(event.pointerId)) return;
            update(size + event.clientX - origin);
        };

        const stop = (event: PointerEvent) => {
            if (handle.hasPointerCapture(event.pointerId)) handle.releasePointerCapture(event.pointerId);
        };

        const keydown = (event: KeyboardEvent) => {
            const { min, max } = limits(workspace);
            const current = currentSize();
            const steps: Record<string, number> = {
                ArrowLeft: -24,
                ArrowRight: 24,
                Home: min - current,
                End: max - current,
            };
            const step = steps[event.key];
            if (step === undefined) return;

            event.preventDefault();
            update(current + step);
        };

        handle.addEventListener('pointerdown', start);
        handle.addEventListener('pointermove', move);
        handle.addEventListener('pointerup', stop);
        handle.addEventListener('pointercancel', stop);
        handle.addEventListener('keydown', keydown);

        return () => {
            handle.removeEventListener('pointerdown', start);
            handle.removeEventListener('pointermove', move);
            handle.removeEventListener('pointerup', stop);
            handle.removeEventListener('pointercancel', stop);
            handle.removeEventListener('keydown', keydown);
        };
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
