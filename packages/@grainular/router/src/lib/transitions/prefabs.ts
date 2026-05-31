import { transition } from './transition';

export const crossFade = (duration: number) => {
    return [
        transition({
            keyframes: [{ opacity: 0 }, { opacity: 1 }],
            element: '::view-transition-new(root)',
            duration,
        }),
        transition({
            keyframes: [{ opacity: 1 }, { opacity: 0 }],
            element: '::view-transition-old(root)',
            duration,
        }),
    ];
};

// slide in from a direction
export const slide = (duration: number, direction: 'left' | 'right' | 'up' | 'down' = 'right') => {
    const axis = direction === 'left' || direction === 'right' ? 'X' : 'Y';
    const sign = direction === 'right' || direction === 'down' ? '' : '-';

    return [
        transition({
            keyframes: [{ transform: `translate${axis}(${sign}100%)` }, { transform: `translate${axis}(0)` }],
            element: '::view-transition-new(root)',
            duration,
        }),
        transition({
            keyframes: [
                { transform: `translate${axis}(0)` },
                { transform: `translate${axis}(${sign === '' ? '-' : ''}100%)` },
            ],
            element: '::view-transition-old(root)',
            duration,
        }),
    ];
};

// scale up, good for modals/detail views
export const scale = (duration: number) => {
    return [
        transition({
            keyframes: [
                { transform: 'scale(0.95)', opacity: 0 },
                { transform: 'scale(1)', opacity: 1 },
            ],
            element: '::view-transition-new(root)',
            duration,
        }),
        transition({
            keyframes: [
                { transform: 'scale(1)', opacity: 1 },
                { transform: 'scale(0.95)', opacity: 0 },
            ],
            element: '::view-transition-old(root)',
            duration,
        }),
    ];
};

// just fade the new in, old stays — subtle
export const fade = (duration: number) => {
    return [
        transition({
            keyframes: [{ opacity: 0 }, { opacity: 1 }],
            element: '::view-transition-new(root)',
            duration,
        }),
    ];
};
