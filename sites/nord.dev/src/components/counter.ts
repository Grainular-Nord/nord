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
            width: 6rem;
            display: flex; 
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
            transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s;
        }

        .counter::after {
            content: "";
            position: absolute;
            inset: 0; /* Cover the button perfectly */
            border-radius: 100%; /* Match button shape */
            
            /* The ring color */
            border: 1px solid var(--syn-val); /* Or use var(--syn-val) to match text */
            opacity: 0.2;
            
            /* The Animation */
            /* 3s duration, infinite loop */
            animation: ping-ripple 5s cubic-bezier(0, 0, 0.2, 1) infinite;
            
            /* Place it behind the button's content visually if transparent */
            z-index: -1; 
        }
        
        .counter:hover {
            transform: scale(1.03) rotate(-1deg);
            box-shadow: 0 15px 35px -5px rgba(0, 0, 0, 0.4);
        }

        .counter:hover::after {
            animation-play-state: paused;
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
