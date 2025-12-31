// Providing a more open type here allows the user or dev
// to implement it's own readonly reactive state mechanism.
export type Subscribable<Value = unknown> = {
    (): Value;
    subscribe: (subscriber: (value: Value) => void) => void | (() => void);
};
