import { createDirective } from '@grainular/nord';

export const clickOutside = (callback: (ev: Event) => void) => {
    return createDirective((element) => {
        const handler = (ev: Event) => {
            if (!element.contains(ev.target as Node)) callback(ev);
        };

        window.addEventListener('pointerdown', handler, true);
        return () => window.removeEventListener('pointerdown', handler, true);
    });
};
