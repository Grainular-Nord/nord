import { grain } from 'http://unpkg.com/@grainular/grains';
import { $each, html, on } from 'http://unpkg.com/@grainular/nord';

const COLORS = ['#18bff1', '#55edda', '#9b74f5', '#6b36d4'];

export const Logo = () => {
    const pressed = grain(false);
    const particles = grain([]);

    const burst = () => {
        const created = Array.from({ length: 6 }, (_, i) => {
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
        <div class="logo-wrap">
            ${$each(particles)
                .$withKey((particle) => particle.id)
                .$as((particle) => html`<span class="particle" style="${particle.style}"></span>`)}
            <img
                class="logo"
                src="./app/nord-logo.svg"
                alt="Nørd logo"
                data-pressed="${pressed}"
                ${on('click', burst)}
            />
        </div>
    `;
};
