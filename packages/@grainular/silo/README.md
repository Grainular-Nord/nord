# @grainular/silo

A store solution for [Grains](https://docs.nordjs.dev/grains) — reactive state with actions, subscriptions, and derived selectors.

## Installation

```bash
npm install @grainular/silo
# or
bun add @grainular/silo
```

## Usage

```ts
import { silo } from '@grainular/silo';

type CounterStore = {
    count: number;
    increment: () => void;
};

const counterStore = silo<CounterStore>((set) => ({
    count: 0,
    increment: () => set({ count: counterStore().count + 1 }),
}));

// Reading state directly
console.log(counterStore().count);

// Subscribing to changes
counterStore.subscribe((state) => console.log(state.count));

// Using a derived selector — only emits when the selected value changes
const count = counterStore.select((state) => state.count);
count.subscribe((value) => console.log(value));
```

A silo is a callable store: calling it returns the current state synchronously. State is only ever mutated from inside the store, via the `set` function passed into `silo`'s initializer — everything else reads it. There's no type inference; you always define the store's shape explicitly to keep it honest to its contract.

## Contributing

Contributions to Nørd are always welcome! Whether it's bug reports, feature requests, or code contributions, please read our [contribution guidelines](../../../contributing.md) for more information on getting involved.

## Disclaimer on the usage of AI & LLMs

Documentation in this package was evaluated and generated with the assistance of LLMs. All AI-generated content has been reviewed for accuracy.

## License

Nørd & its packages are open-source software licensed under the MIT License.
