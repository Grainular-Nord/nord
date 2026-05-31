export type Transition = {
    keyframes: Keyframe[];
    duration: number;
    delay?: number;
    easing?: string;
    element?: '::view-transition-new(root)' | '::view-transition-old(root)' | string;
};

export const transition = (setup: Transition): Required<Transition> => {
    return {
        delay: 0,
        easing: 'linear',
        element: '::view-transition-new(root)',
        ...setup,
    };
};
