import { createDirective } from '@grainular/nord';

export const active = (cls: string, { exact }: { exact: boolean } = { exact: true }) => {
    return createDirective((node) => {
        const handler = () => {
            const href = node.getAttribute('href');
            const destination = navigation.currentEntry?.url;

            // Should both be not possible, but alas.
            if (!destination || !href) return;
            const url = new URL(destination);
            node.classList.toggle(cls, exact ? url.pathname === href : url.pathname.startsWith(href));
        };

        navigation.addEventListener('navigatesuccess', handler);
        return () => navigation.removeEventListener('navigatesuccess', handler);
    });
};
