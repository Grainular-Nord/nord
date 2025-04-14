import { grain, readonly } from '@grainular/grains';
import { createDirective } from './create-directive';

export const ref = <T extends HTMLElement>() => {
    const element = grain<{ nativeElement: T } | null>(null);

    return Object.assign(readonly(element), {
        attach: () =>
            createDirective((node) => {
                element.set({ nativeElement: node as T });
                return () => element.set(null);
            }),
    });
};
