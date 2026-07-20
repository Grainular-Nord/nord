import { grain } from '@grainular/grains';
import { $each, html, on } from '@grainular/nord';

const COLORS = ['#18bff1', '#55edda', '#9b74f5', '#6b36d4'];

type Particle = { id: number; style: string };

export const Logo = () => {
    const pressed = grain(false);
    const particles = grain<Particle[]>([]);

    const burst = () => {
        const created: Particle[] = Array.from({ length: 6 }, (_, i) => {
            const angle = (Math.random() - 0.5) * 100;
            const size = 4 + Math.random() * 4;
            const left = 50 + (Math.random() - 0.5) * 40;
            const duration = 0.7 + Math.random() * 0.3;
            return {
                id: Date.now() + i,
                style: `left:${left}%;--px:${angle}px;width:${size}px;height:${size}px;background:${COLORS[i % COLORS.length]};animation-duration:${duration}s;`,
            };
        });

        pressed.set(true);
        particles.update((current) => [...current, ...created]);

        setTimeout(() => pressed.set(false), 160);
        setTimeout(() => {
            particles.update((current) => current.filter((particle) => !created.includes(particle)));
        }, 1100);
    };

    return html`
        <div class="relative flex h-28 w-28 items-center justify-center">
            ${$each(particles)
                .$withKey((particle) => particle.id)
                .$as(
                    (particle) =>
                        html`<span
                            class="absolute top-[20%] animate-[particle-rise_0.8s_ease-out_forwards] rounded-full"
                            style="${particle.style}"
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
