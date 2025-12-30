export type CustomElementSelector = `${string}-${string}`;
export type CustomElementDefinition<T extends Lowercase<string> = never> = {
    selector: CustomElementSelector;
    attributes?: T[];
    scoped?: boolean;
    styles?: string[];
    onMount?: () => void;
    onUnmount?: () => void;
};
