// Shared keyboard- and pointer-resizing for editor panes.
import { mounted } from '@grainular/nord';

/** Logical axis used by the reusable resize directive. */
export type ResizeAxis = 'block' | 'inline';

type ResizeBounds = { min: number; max: number };

type ResizableOptions = {
    axis: (container: HTMLElement) => ResizeAxis;
    bounds: (container: HTMLElement, axis: ResizeAxis) => ResizeBounds;
    container: (handle: HTMLElement) => HTMLElement | null;
    measure?: (handle: HTMLElement, container: HTMLElement, axis: ResizeAxis) => number;
    resize: (container: HTMLElement, axis: ResizeAxis, size: number) => void;
};

const pointerPosition = (event: PointerEvent, axis: ResizeAxis) => (axis === 'inline' ? event.clientX : event.clientY);

/**
 * Makes a separator keyboard- and pointer-resizable within its container.
 *
 * `measure` is important when the resizable pane does not start at the
 * container's origin (for example, when a persistent file tree precedes it).
 * Without it, a pointer drag would incorrectly include that preceding width.
 */
export const resizable = ({ axis, bounds, container: findContainer, measure, resize }: ResizableOptions) =>
    // The container may be outside a component's template. Resolve it after
    // mount, when the template has been inserted into its actual layout.
    mounted((handle) => {
        if (!(handle instanceof HTMLElement)) return () => {};
        const container = findContainer(handle);
        if (!container) return () => {};

        const currentSize = () => {
            const currentAxis = axis(container);
            if (measure) return measure(handle, container, currentAxis);
            const containerBounds = container.getBoundingClientRect();
            const handleBounds = handle.getBoundingClientRect();
            return currentAxis === 'inline'
                ? handleBounds.left + handleBounds.width / 2 - containerBounds.left
                : handleBounds.top + handleBounds.height / 2 - containerBounds.top;
        };
        const update = (next: number) => {
            const currentAxis = axis(container);
            const { min, max } = bounds(container, currentAxis);
            const value = Math.min(Math.max(next, min), max);
            resize(container, currentAxis, value);
            handle.setAttribute('aria-orientation', currentAxis === 'inline' ? 'vertical' : 'horizontal');
            handle.setAttribute('aria-valuemin', `${Math.round(min)}`);
            handle.setAttribute('aria-valuemax', `${Math.round(max)}`);
            handle.setAttribute('aria-valuenow', `${Math.round(value)}`);
        };

        let origin = 0;
        let size = 0;
        const start = (event: PointerEvent) => {
            origin = pointerPosition(event, axis(container));
            size = currentSize();
            update(size);
            handle.setPointerCapture(event.pointerId);
        };
        const move = (event: PointerEvent) => {
            if (handle.hasPointerCapture(event.pointerId))
                update(size + pointerPosition(event, axis(container)) - origin);
        };
        const stop = (event: PointerEvent) => {
            if (handle.hasPointerCapture(event.pointerId)) handle.releasePointerCapture(event.pointerId);
        };
        const keydown = (event: KeyboardEvent) => {
            const currentAxis = axis(container);
            const keys = currentAxis === 'inline' ? ['ArrowLeft', 'ArrowRight'] : ['ArrowUp', 'ArrowDown'];
            if (![...keys, 'Home', 'End'].includes(event.key)) return;
            const { min, max } = bounds(container, currentAxis);
            const step = event.key === keys[0] ? -24 : event.key === keys[1] ? 24 : 0;
            event.preventDefault();
            update(event.key === 'Home' ? min : event.key === 'End' ? max : currentSize() + step);
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
