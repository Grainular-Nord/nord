# @grainular/router

Client-side routing for [Nord](https://docs.nordjs.dev), built on the browser's [Navigation API](https://developer.mozilla.org/en-US/docs/Web/API/Navigation_API).

## Installation

```bash
npm install @grainular/router
# or
bun add @grainular/router
```

## Usage

```ts
import { createRouter, $outlet, navigate } from '@grainular/router';
import { html } from '@grainular/nord';
import { Home } from './pages/home';
import { About } from './pages/about';

const router = createRouter('/', [
    { path: '/', component: () => Home() },
    { path: '/about', component: () => About() },
]);

const App = () => html`<div>${$outlet({ for: router })}</div>`;

navigate('/about');
```

`createRouter(base, routes)` matches the current URL against a list of routes and exposes `params`, `query`, and `state` as grains. `$outlet` renders the matched route's component and reacts to navigation changes; `navigate` triggers a route change programmatically. Routes can declare `use` (navigation hooks — `pre`/`post`/`load`) and `transition` (view transitions via `fade`, `slide`, `scale`, `crossFade`) for more advanced flows, and the `active` directive toggles a class on links matching the current path.

## Contributing

Contributions to Nørd are always welcome! Whether it's bug reports, feature requests, or code contributions, please read our [contribution guidelines](../../../contributing.md) for more information on getting involved.

## Disclaimer on the usage of AI & LLMs

Documentation in this package was evaluated and generated with the assistance of LLMs. All AI-generated content has been reviewed for accuracy.

## License

Nørd & its packages are open-source software licensed under the MIT License.
