import { grain } from '@grainular/grains';
import { $each, html, on } from '@grainular/nord';

const COLORS = ['#18bff1', '#55edda', '#9b74f5', '#6b36d4'];
const rand = (min: number, max: number) => min + Math.random() * (max - min);

export const Logo = () => {
    const pressed = grain(false);
    const streaks = grain<string[]>([]);

    const burst = () => {
        const created = Array.from(
            { length: 6 },
            (_, i) =>
                `left:${rand(20, 60)}%;--px:${rand(-50, 50)}px;--tilt:${rand(-25, 25)}deg;width:${rand(24, 56)}px;--color:${COLORS[i % COLORS.length]};animation-duration:${rand(0.7, 1.1)}s;`,
        );

        pressed.set(true);
        streaks.update((current) => [...current, ...created]);

        setTimeout(() => pressed.set(false), 160);
        setTimeout(() => streaks.update((current) => current.filter((s) => !created.includes(s))), 1200);
    };

    return html`
        <div class="logo-wrap">
            ${$each(streaks).$as((style) => html`<span class="streak" style="${style}"></span>`)}
            <img class="logo" src="/nord-logo.svg" alt="Nørd logo" data-pressed="${pressed}" ${on('click', burst)} />
        </div>
    `;
};
