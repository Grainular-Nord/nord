import type { WritableGrain } from '@grainular/grains';
import { css, html, on, withScopedStyles } from '@grainular/nord';

// The simple counter component is (basically)
// the same as the one displayed in the editor
// the only difference is, the counter receives
// the count as prop instead of defining it locally.
export const Counter = withScopedStyles(
    ({ count }: { count: WritableGrain<number> }) => {
        // Method to increment the count value
        const increment = () => {
            count.set(count() + 1);
        };

        return html`
        <button ${on('click', increment)}>
            ${count}
        </button>
    `;
    },
    /**
     * Scoping the output styles directly to
     * the component allows easier association
     */
    css`
        button {
            background: red; 
        }
    `,
);
