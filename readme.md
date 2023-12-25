<!-- @format -->

# Nørd

[![Npm package version](https://badgen.net/npm/v/@nord/core)](https://www.npmjs.com/package/@nord/core)
[![Npm package total downloads](https://badgen.net/npm/dt/@nord/core)](https://npmjs.com/package/@nord/core)
[![Npm package license](https://badgen.net/npm/license/@nord/core)](https://npmjs.com/package/@Nørd/core)

Nørd is a cutting-edge frontend JavaScript framework designed for building reactive web applications with ease and efficiency. Emphasizing reactivity and simplicity, Nørd integrates seamlessly into your web development workflow, providing a robust solution for state management and component-based architecture. Lightweight, dependency-free and powerful, Nørd is ideal for both small and large-scale applications.

## Installing

To use Nørd in your project, install it via yarn or npm:

```bash
yarn add @nord/core
# or use npm
npm install @nord/core
```

## Getting Started

Import the basic functions to create a small "Hello World" component.

```js
import { createComponent, grain, render } from '@nord/core';

const App = createComponent({
    template: (html, { name }) => html`<h1>Hello, ${name}</h1>`,
});

render(App, {
    target: document.querySelector('body'),
    hydrate: { name: grain('World') },
});
```

## Contributing

Contributions to Nørd are always welcome! Whether it's bug reports, feature requests, or code contributions, please read our [contribution guidelines](./contributing.md) for more information on getting involved.

## License

Nørd is open-sourced software licensed under the MIT License.
