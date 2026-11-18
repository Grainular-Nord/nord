# @grainular/forms

Form state, validation, and binding for [Nord](https://docs.nordjs.dev).

## Installation

```bash
npm install @grainular/forms
# or
bun add @grainular/forms
```

## How it works

`form(model, schema)` takes a plain data object and derives a matching tree of reactive controls — one per field, nested objects and arrays included. Each control tracks its own `value`, `errors`, `touched`, `dirty`, and `disabled` state as grains, while the form itself exposes aggregated `value`, `errors`, `isValid`, and `isTouched` grains derived from the whole tree.

```ts
import { form, required, email } from '@grainular/forms';

const { validate, value, controls } = form({ email: '', password: '' }, (schema) => {
    required(schema.email, { message: 'Required' });
    email(schema.email, { message: 'Enter a valid email' });
    required(schema.password, { message: 'Required' });
});

// validate() touches all controls and runs the schema's validators
if (validate()) submit(value());
```

Controls bind to inputs via the `bind` directive inside a Nord template, and validators (`required`, `email`, `min`, `maxLength`, `pattern`, …) write into a control's `errors` grain when its value is invalid.

For a single `<select multiple>` backed by a string array, use the `multiselect` directive:

```ts
import { form, multiselect } from '@grainular/forms';
import { html } from '@grainular/nord';

const preferences = form({ topics: ['news'] });

const Topics = () => html`
    <select multiple ${multiselect(preferences.controls.topics)}>
        <option value="news">News</option>
        <option value="events">Events</option>
    </select>
`;
```

The directive exposes its single control as `topics.control`, with its own `touched`, `dirty`, `disabled`, and `errors` state. Its value is synchronized with the list: selection changes replace the list using its `set` method, and programmatic list changes update the select. Selections are strings, matching the browser's option values.

The wrapper's control state is separate from the list items' state. Use `topics.control.reset()` to reset the control and list value.

## Contributing

Contributions to Nørd are always welcome! Whether it's bug reports, feature requests, or code contributions, please read our [contribution guidelines](../../../contributing.md) for more information on getting involved.

## Disclaimer on the usage of AI & LLMs

Documentation in this package was evaluated and generated with the assistance of LLMs. All AI-generated content has been reviewed for accuracy.

## License

Nørd & its packages are open-source software licensed under the MIT License.
