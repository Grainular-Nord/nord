import { grain } from '@grainular/grains';
import { $render, $unsafeHtml, type ComponentFragment, html } from '@grainular/nord';

export const icons = {
    flag: () => import('./assets/flag.svg?raw'),
    plot: () => import('./assets/plot.svg?raw'),
    gear: () => import('./assets/gear.svg?raw'),
    grid: () => import('./assets/grid.svg?raw'),
    clock: () => import('./assets/clock.svg?raw'),
    restart: () => import('./assets/restart.svg?raw'),
    bomb: () => import('./assets/bomb.svg?raw'),
};

export type IconSrc = (typeof icons)[keyof typeof icons];

const AssetProvider = (() => {
    const cacheMap = new Map<IconSrc, string>();

    return {
        get: async (fn: IconSrc) => {
            // if not cached, load and set
            if (!cacheMap.has(fn)) {
                const result = await fn();
                cacheMap.set(fn, result.default);
            }

            // biome-ignore lint: if it didn't exist, we created it
            return cacheMap.get(fn)!;
        },
    };
})();

const getSvgString = (fragment: string, props?: Omit<IconProps, 'src'>) => {
    return `<svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                width="${props?.size ?? 24}"
                height="${props?.size ?? 24}"
                fill="${props?.fill ?? 'none'}" 
                stroke="${props?.stroke ?? 'currentColor'}" 
                stroke-width="${props?.strokeWidth ?? 1.5}" 
                stroke-linecap="round" 
                stroke-linejoin="round"
            >
                ${fragment}
            </svg>`;
};

export type IconProps = {
    /**
     * The source loader for the icons.
     */
    src: IconSrc;

    /**
     * An optional size prop to set the size of the
     * component itself
     */
    size?: 12 | 16 | 24;

    /**
     * An optional stroke width property to set
     * the stroke width of the svg
     */
    strokeWidth?: number;

    fill?: string;
    stroke?: string;
};

export const Icon = ({ src, ...props }: IconProps) => {
    const fragment = grain<ComponentFragment>(html``);
    AssetProvider.get(src).then((svg) => fragment.set(html`${$unsafeHtml(getSvgString(svg, props))}`));
    return html`${$render(fragment)}`;
};
