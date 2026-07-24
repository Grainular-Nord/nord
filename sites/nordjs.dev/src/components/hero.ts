import { grain } from '@grainular/grains';
import { html } from '@grainular/nord';
import { css, withStyles } from '@grainular/styled';
import { Counter } from './counter';
import { Editor } from './editor';

const tags = [
    'Because Functions are the better Components.',
    '9kb Runtime. 0 Dependencies. 0 Tooling Required.',
    'Work with the Browser, not against it.',
    'The Browser is the framework. Ship what you write.',
    'Smaller than your node_modules folder. Probably.',
    'No compiler. No magic. No excuses.',
];

export const Hero = () => {
    const count = grain(0);

    return withStyles(
        () => html` <section class="hero">
            <div class="hero-text">
                <h1>Nørd</h1>
                <div>Build apps, not bundles.</div>
                <div class="sub-text">${tags[Math.floor(Math.random() * tags.length) * 1]}</div>
                <a class="docs-link" href="https://docs.nordjs.dev" rel="noopener noreferrer">Read the Docs &rarr;</a>
            </div>
            <div class="hero-code">${Editor({ count })} ${Counter({ count })}</div>
        </section>`,
        () => css`
            .hero {
                display: flex;
                flex-wrap: wrap;
                flex-grow: 1;
                gap: 1.5rem;

                & .hero-text {
                    display: flex;
                    flex-direction: column;
                    gap: 0.25rem;
                    flex: 1;

                    min-width: min(100%, 300px);

                    font-size: 2rem;
                    color: var(--text-main);
                    padding-block: 2rem;

                    & h1 {
                        font-size: 5.5rem;
                        letter-spacing: -0.03em;
                        background: linear-gradient(to right, var(--nord-aurora-1), var(--nord-aurora-2));
                        background-clip: text;
                        -webkit-background-clip: text;
                        color: transparent;
                        text-shadow: 0 0 1.5rem rgba(155, 155, 155, 0.5);
                    }

                    & div {
                        font-weight: 600;
                    }

                    & .sub-text {
                        font-size: 1rem;
                        font-weight: 400;
                        color: var(--text-sub);
                    }

                    & .docs-link {
                        margin-top: 0.75rem;
                        width: fit-content;

                        font-size: 1rem;
                        font-weight: 600;
                        color: var(--text-main);
                        text-decoration: underline;
                        text-decoration-color: color-mix(in srgb, var(--text-main), transparent 60%);
                        text-underline-offset: 4px;
                        transition:
                            color var(--transition-speed),
                            text-decoration-color var(--transition-speed);

                        &:hover {
                            color: var(--nord-aurora-2);
                            text-decoration-color: currentColor;
                        }
                    }
                }

                & .hero-code {
                    flex: 1;
                    min-width: min(100%, 400px);
                    align-self: center;
                    position: relative;
                    padding-inline: 2rem;
                }
            }

            @keyframes fade-in {
                from {
                    opacity: 0;
                }
                to {
                    opacity: 1;
                }
            }

            @media (max-width: 768px) {
                .hero {
                    & .hero-code {
                        padding: 0;
                    }
                }
            }
        `,
    );
};
