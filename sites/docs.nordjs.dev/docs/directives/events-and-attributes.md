---
title: Events and attributes
description: Register event listeners and apply reactive attributes.
layout: docs
---

# Events and attributes

Nørd provides small directives for common element behavior. `on` owns browser event listeners; `attr` applies one or more attributes when direct template interpolation is not the clearest fit.

## Event listeners with `on`

`on` accepts a browser event name, listener, and optional listener options. TypeScript infers the event object from its name.

```ts title="counter.ts"
import { html, on } from '@grainular/nord';

const increment = (event: MouseEvent) => {
    console.log(event.clientX);
};

const Counter = () => html`<button ${on('click', increment)}>Increment</button>`;
```

The handler is an ordinary function. It can read grains, update state, call browser APIs, or delegate to another module.

## Event listener cleanup

Nørd removes an `on` listener when its host element disconnects. You do not need an effect wrapper or separate teardown for normal element listeners.

```ts title="form.ts"
const Form = () => html`
    <form ${on('submit', (event) => event.preventDefault())}>
        <button>Save</button>
    </form>
`;
```

The same cleanup rule applies when another library or direct DOM code removes the element.

## Attributes with `attr`

Use `attr` when attributes are assembled as a record, such as a reusable component helper or a dynamic set of `data-*` attributes.

```ts title="button.ts"
import { attr, html } from '@grainular/nord';

const buttonAttributes = {
    type: 'button',
    'data-variant': 'primary',
};

const Button = () => html`<button ${attr(buttonAttributes)}>Save</button>`;
```

For a single known attribute, direct interpolation remains the simplest form: `aria-label="${label}"`.

## Reactive attributes

Record values may be subscribables. `attr` reads their initial value, subscribes to changes, and releases every subscription with the host element.

```ts title="save-button.ts"
import { attr, html, type Subscribable } from '@grainular/nord';

const SaveButton = ({ saving }: { saving: Subscribable<boolean> }) => html`
    <button ${attr({ disabled: saving, 'aria-busy': saving })}>Save</button>
`;
```

HTML boolean attributes use presence semantics: a truthy `disabled` produces `disabled`, while a falsy value removes it. ARIA attributes are ordinary string attributes, so `aria-busy` becomes `"true"` or `"false"`.

## Native DOM properties

`attr` deliberately writes attributes. Many HTML attributes reflect to a DOM property, but some browser APIs are property-only or have different semantics. Use a custom directive or a ref when you need the property itself.

```ts title="input-value.ts"
import { createDirective, html } from '@grainular/nord';

const value = createDirective<HTMLInputElement>((input) => {
    input.value = 'Initial value';
});

const Input = () => html`<input ${value} />`;
```

This distinction keeps templates honest: attributes describe markup, while directives can use the full DOM API when behavior requires it.
