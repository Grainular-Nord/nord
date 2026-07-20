import { html } from '@grainular/nord';
import { css, withStyles } from '@grainular/styled';

export const Aurora = () => {
    return withStyles(
        () => html`<div class="aurora"></div>`,
        () => css`
        .aurora {
            position: fixed;
            inset: 0;
            z-index: 0;
            pointer-events: none;
            background:
                radial-gradient(
                    40rem circle at 22% 22rem,
                    color-mix(in srgb, var(--nord-aurora-1), transparent 89%),
                    transparent
                ),
                radial-gradient(
                    36rem circle at 96% 44rem,
                    color-mix(in srgb, var(--nord-aurora-2), transparent 90%),
                    transparent
                );
        }`,
    );
};
