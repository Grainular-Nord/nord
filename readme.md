<!-- @format -->

# Nørd

[![Npm package version](https://badgen.net/npm/v/@grainular/nord)](https://www.npmjs.com/package/@grainular/nord)
[![Npm package total downloads](https://badgen.net/npm/dt/@grainular/nord)](https://npmjs.com/package/@grainular/nord)
[![Npm package license](https://badgen.net/npm/license/@grainular/nord)](https://npmjs.com/package/@grainular/nord)

Nørd is a cutting-edge frontend JavaScript framework designed for building reactive web applications with ease and efficiency. Emphasizing reactivity and simplicity, Nørd integrates seamlessly into your web development workflow, providing a robust solution for state management and component-based architecture. Lightweight, dependency-free and powerful, Nørd is ideal for both small and large-scale applications.

## Installing

To use Nørd in your project, install it via yarn or npm:

```bash
yarn add @grainular/nord
# or use npm
npm install @grainular/nord
```

## Getting Started

Import the basic functions to create a small "Hello World" component.

```js
import { createComponent, grain, render } from '@grainular/nord';

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
