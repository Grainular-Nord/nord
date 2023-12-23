/** @format */

export enum Error {
    TARGET_NOT_FOUND = '[Nørd:Render] "options.target" is "undefined" or "null". Expected an instance of "Element".',
    NO_COMPONENT_PROVIDED = '[Nørd:Render] Component is "undefined" or "null". Pass a Nord Component to render it to the DOM".',
    DERIVED_ALREADY_DESTROYED = '[Nørd:Derived] Derived grain has already been destroyed.',
    SELECTOR_USED = '[Nørd:Component] Selector already in use.',
    NOT_A_GRAIN = '[Nørd:Readonly]: Value is not a Grain',
}
