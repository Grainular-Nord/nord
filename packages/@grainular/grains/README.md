# @grainular/grains

Reactive primitives for [Nord](https://docs.nordjs.dev). Grains are synchronous, subscribable values — the core building block of reactive state in Nord applications.

## Installation

```bash
npm install @grainular/grains
# or
bun add @grainular/grains
```

## Usage

```ts
import { grain } from '@grainular/grains';

// Create a grain with an initial value
const count = grain(0);

// Subscribe to changes — called whenever the value updates
count.subscribe(value => console.log(value));

// Set a new value, notifying all subscribers
count.set(1); // Logs: 1
```

## Primitives

`grain` · `readonly` · `derived` · `combined` · `flattened`

> Full documentation at [docs.nordjs.dev/grains](https://docs.nordjs.dev/grains).

## Contributing

Contributions to Nørd are always welcome! Whether it's bug reports, feature requests, or code contributions, please read our [contribution guidelines](./contributing.md) for more information on getting involved.

## Disclaimer on the usage of AI & LLMs

Documentation in this package was evaluated and generated with the assistance of LLMs. Tests where also largely generated via LLMs. All AI-generated content has been reviewed for accuracy.

## License

Nørd & it's packages are open-source software licensed under the MIT License.
