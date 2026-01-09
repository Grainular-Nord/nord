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
        <button class="counter" ${on('click', increment)}>
            <span>Click to +</span>
            ${count}
        </button>
    `;
    },
    /**
     * Scoping the output styles directly to
     * the component allows easier association
     */
    css`
        .counter {
            position: absolute;
            right: 0.5rem;
            bottom: -1.5rem;
            
            /* Sizing: Big and tactile */
            aspect-ratio: 1 / 1;
            font-size: 2.5rem;
            font-weight: 700;
            width: 6.5rem;
            display: flex; 
            flex-direction: column; 
            justify-content: center; 
            align-items: center;
            
            /* Shape */
            border-radius: 100%; 
            border: 4px solid color-mix(in srgb, var(--syn-val), transparent 92%);
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3); /* Heavy lift */            
            background: var(--bg-editor);
            backdrop-filter: blur(2px);
            color: var(--syn-val);
            
            cursor: pointer;
            z-index: 10;
            transition: transform 0.2s cubic-bezier(0.52, 2.03, 0.43, 0.9), box-shadow 0.2s;

            & span {
                font-size: 0.85rem; 
                font-weight: 500;
            }
        }

        .counter:hover {
            transform: scale(1.03);
            box-shadow: 0 15px 35px -5px rgba(0, 0, 0, 0.4);
        }

        .counter:active {
            transform: scale(0.98);
        }

        @keyframes ping-ripple {
            75%, 100% {
                transform: scale(2);
                opacity: 0;
            }
        }
    `,
);
