import { css, html, withScopedStyles } from '@grainular/nord';

export const Aurora = withScopedStyles(
    () => {
        return html`<div class="aurora"></div>`;
    },
    css`
        .aurora {
            position: fixed;
            inset: 0;
            z-index: -1;
            filter: blur(180px);

        &::before,
        &::after {
            content: '';
            position: absolute;
            width: 90vw;
            height: 90vw;
            border-radius: 50%;
            opacity: 0.3;
            animation: drift 40s infinite ease-in-out alternate;
        }

        &::before {
            top: -30%;
            left: -30%;
            background: radial-gradient(circle, var(--nord-aurora-2), transparent 50%);
        }

        &::after {
            bottom: -30%;
            right: -30%;
            background: radial-gradient(circle, var(--nord-aurora-1), transparent 50%);
            animation-delay: -40s;
        }
        }

        @keyframes drift {
            0% { transform: translate(0, 0) rotate(0deg); }
            100% { 
                transform: translate(30vw, 15vh) rotate(30deg);
                filter: hue-rotate(30deg); 
            }
        }
`,
);
