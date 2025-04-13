import { createDirective } from './create-directive';

export const on = <Key extends keyof HTMLElementEventMap>(
    event: Key,
    listener: (event: HTMLElementEventMap[Key]) => void,
    options?: AddEventListenerOptions,
) => {
    const handler = (ev: Event) => listener(ev as HTMLElementEventMap[Key]);
    return createDirective((node: Element) => {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    });
};
