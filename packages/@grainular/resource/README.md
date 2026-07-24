# @grainular/resource

A reactive, abortable async resource for [Nord](https://docs.nordjs.dev) and [Grains](https://docs.nordjs.dev/grains).

## Installation

```bash
npm install @grainular/resource
# or
bun add @grainular/resource
```

## Usage

```ts
import { resource } from '@grainular/resource';
import { grain } from '@grainular/grains';

const userId = grain(1);

const user = resource(
    ({ abortSignal }) => fetch(`/api/users/${userId()}`, { signal: abortSignal }).then((res) => res.json()),
    [userId], // re-fetches whenever userId changes
);

user.pending.subscribe((pending) => console.log('loading:', pending));
user.data.subscribe((data) => console.log('user:', data));
```

`resource(fetcher, deps?)` runs `fetcher` once immediately and again whenever any grain in `deps` changes, aborting an in-flight request before starting the next one. It exposes:

- `state` / `idle` / `pending` / `error` — the current lifecycle as grains (`data` is only valid while `idle`)
- `data` — the last resolved value
- `refresh()` — manually re-run the fetcher
- `abort()` — cancel the current request without changing `data`
- `mutate(next)` — set `data` directly without fetching
- `destroy()` — unsubscribe from dependencies and abort any in-flight request

## Contributing

Contributions to Nørd are always welcome! Whether it's bug reports, feature requests, or code contributions, please read our [contribution guidelines](../../../contributing.md) for more information on getting involved.

## Disclaimer on the usage of AI & LLMs

Documentation in this package was evaluated and generated with the assistance of LLMs. All AI-generated content has been reviewed for accuracy.

## License

Nørd & its packages are open-source software licensed under the MIT License.
