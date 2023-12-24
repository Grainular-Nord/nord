/** @format */

export const On = (
    event: keyof HTMLElementEventMap,
    listener: (event: Event) => void,
    options?: AddEventListenerOptions
) => {
    // Return the created template directive
    const eventFunc = (element: Element) => {
        element.addEventListener(event, (ev) => listener(ev), options);
    };

    return { '@event': eventFunc };
};
