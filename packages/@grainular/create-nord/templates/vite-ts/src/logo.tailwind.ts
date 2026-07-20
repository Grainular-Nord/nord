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
        <div class="relative flex h-28 w-28 items-center justify-center">
            ${$each(streaks).$as(
                (style) =>
                    html`<span
                        class="pointer-events-none absolute top-[4%] h-[5px] animate-[streak-rise_0.8s_ease-out_forwards] rounded-full bg-[linear-gradient(90deg,transparent,var(--color),transparent)] shadow-[0_0_12px_var(--color)] blur-[2px]"
                        style="${style}"
                    ></span>`,
            )}
            <img
                class="h-28 w-28 cursor-pointer transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] data-[pressed=true]:scale-95 data-[pressed=true]:duration-150"
                src="/nord-logo.svg"
                alt="Nørd logo"
                data-pressed="${pressed}"
                ${on('click', burst)}
            />
        </div>
    `;
};
