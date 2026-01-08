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
            position: absolute;
            right: 0.5rem;
            bottom: -1.5rem;
            
            /* Sizing: Big and tactile */
            aspect-ratio: 1 / 1;
            font-size: 2.5rem;
            font-weight: 700;
            width: 6rem;
            display: flex; 
            justify-content: center; 
            align-items: center;
            
            /* Shape */
            border-radius: 100%; 
            border: 4px solid color-mix(in srgb, var(--text-main), transparent 92%);
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3); /* Heavy lift */            
            background: var(--bg-editor);
            backdrop-filter: blur(2px);
            color: var(--syn-val);
            
            cursor: pointer;
            z-index: 10;
            transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s;
        }
        
        button:hover {
            transform: scale(1.03) rotate(-1deg);
            box-shadow: 0 15px 35px -5px rgba(0, 0, 0, 0.4);
        }

        button:active {
            transform: scale(0.98);
        }
    `,
);
