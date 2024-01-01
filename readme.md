<!-- @format -->

# Nørd

<p align="center">
  <img src="https://nordjs.dev/nord-logo.png" alt="Nørd Logo">
</p>

[![Npm package version](https://badgen.net/npm/v/@grainular/nord)](https://www.npmjs.com/package/@grainular/nord)
[![Npm package total downloads](https://badgen.net/npm/dt/@grainular/nord)](https://npmjs.com/package/@grainular/nord)
[![Npm package license](https://badgen.net/npm/license/@grainular/nord)](https://npmjs.com/package/@grainular/nord)

Nørd is a modern JavaScript framework that enables developers to build web applications with fine-grained reactivity and a component-based architecture. It uses [tagged templates](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#tagged_templates) for HTML rendering and Grains as primary reactive primitive. Nørd is [TypeScript](https://www.typescriptlang.org/)-centric, offering fully typed components and templates.

## Key Features

-   **Component-Based Architecture**: Build your UI with reusable and composable components, enhancing maintainability and reusability.
-   **Fine-Grained Reactivity**: Efficiently update your UI with fine-grained reactivity using Grains, a unique feature that connects values directly to DOM nodes.
-   **No JSX Required**: Utilize tagged template literals for a cleaner and more intuitive syntax, removing the need for compiling JSX.
-   **TypeScript Support**: Take advantage of full TypeScript support for a strongly typed development experience, enhancing code quality and maintainability.
-   **Directives**: Enhance your templates with powerful directives for DOM manipulation, offering declarative access to the DOM.
-   **Dependency-Free**: Enjoy the benefits of a framework that operates without external dependencies, making your project lightweight and faster to load.

## Getting Started

### In the Browser

Before diving into a full project, you can experiment with Nørd directly in your browser:

**JSFiddle**: For a quick and straightforward experience, try out Nørd using this [JSFiddle](https://jsfiddle.net/iamsebastiandev/ctnm8yw9) link. It provides a basic HTML setup to test out Nørd's features.
**StackBlitz**: For a more comprehensive exploration, including Vite and TypeScript support, visit this [StackBlitz](https://stackblitz.com/edit/nord?file=src%2Fmain.ts) project. It's a great way to see Nørd in action within a more complex environment.

### Scaffolding a new Project

To start a new Nørd project, use the official scaffolding tool. Make sure you have [Node.js](https://nodejs.org/en/download/current) version 18.0 or higher installed, then run:

```bash
# Using yarn
yarn create @grainular/nord

# Using npm
npm create @grainular/nord
```

This command will execute the **@grainular/create-nord** tool, guiding you through the process of creating a new project. You can choose from various templates, such as a basic HTML setup or a modern Vite-based template with TypeScript.

### Installing

To add Nørd to your existing project, you can install it via npm or yarn:

```bash
# Using yarn
yarn add @grainular/nord

# Using npm
npm install @grainular/nord
```

### Using Nørd

Once Nørd is added to your project, you can start by importing it. Here's a basic example to get you started:

```js
import { createComponent, render } from '@grainular/nord';

const App = createComponent((html) => html`<h1>Hello, Nørd!</h1>`);

render(App, { target: document.querySelector('#app') });
```

In this example, createComponent is used to define a new component, and render attaches it to the DOM, targeting a specific element. This setup demonstrates the simplicity and power of Nørd's component system and rendering process.

## Components

In Nørd, components are essential for building the UI. They are defined using the `createComponent` function, which encapsulates both logic and presentation:

> Read more about components in the [official documentation](https://nordjs.dev/guide/components).

### Creating a Component

```js
import { createComponent } from '@grainular/nord';

const Greeting = createComponent((html, { name }) => {
    html`<h1>Hello, ${name}</h1>`;
});
```

This example shows a `Greeting` component that renders a name within an `<h1>` tag.

> In Nørd, both components and their templates are evaluated only once. This means that the logic inside the component function runs only during the initial creation. It creates a static structure, with reactivity handled by Grains and Directives rather than re-evaluating the entire template.

### Rendering a Component

To display your component in the DOM, use the `render` function:

```js
import { render } from '@grainular/nord';
import { Greeting } from './greeting.component.js';

render(Greeting, {
    target: document.querySelector('#app'),
    hydrate: { name: 'World' },
});
```

Here, `Greeting` is rendered inside a specified DOM element with properties passed via the `hydrate` option.

## Grains

Grains are Nørd's reactive primitives, central to its state management. They provide a way to create and manage reactive states in your application.

> Read more about grains in the [official documentation](https://nordjs.dev/guide/grains).

### Creating and using Grains

A Grain is created with the `grain` function and is used to store and react to changes in data:

```js
import { grain } from '@grainular/nord';

const count = grain(0); // Initialize a Grain with a value
console.log(count()); // Access the current value
```

### Updating a Grain

```js
import { grain } from '@grainular/nord';

const count = grain(0); // Initialize a Grain with a value
count.set(1); // Sets the value
count.update((c) => c + 1); // Updates the value
```

### Subscribing to changes

Grains allow subscription to value changes, enabling components to reactively update:

```js
count.subscribe((value) => {
    console.log(`Count updated to: ${value}`);
});
```

When `count` is set to a new value, the subscribed function will execute, providing the updated value.

## Directives

Directives in Nørd provide a declarative way to manipulate the DOM within templates. They are functions that receive DOM nodes and apply dynamic logic or behaviour.

> Read more about directives in the [official documentation](https://nordjs.dev/guide/directives).

### Usage

A simple directive is a function that takes a node as an argument:

```js
<div ${(node) => console.log(node)} ></div>
```

This directive logs the associated DOM element when the component is evaluated.

### Directive Factories

Nørd comes with built-in directive factories for common tasks. For example, the `on` directive factory attaches event listeners:

```js
import { on } from '@grainular/nord';

<button ${on('click', (ev) => console.log(ev))} ></button>
```

In this case, clicking the button logs the click event.

### Custom Directives

You can create custom directives using `createDirective`:

```js
import { createDirective } from '@grainular/nord';

export const applyColor = createDirective((node) => {
    node.style.background = 'red';
});

// Usage
<div ${applyColor} ></div>
```

This custom directive changes the background color of the element to red.

## Contributing

Contributions to Nørd are always welcome! Whether it's bug reports, feature requests, or code contributions, please read our [contribution guidelines](./contributing.md) for more information on getting involved.

## License

Nørd is open-sourced software licensed under the MIT License.
