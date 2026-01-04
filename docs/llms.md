# Overview of @grainular/nord

**@grainular/nord** or **nord** or **nørd** is a lightweight, reactive JavaScript framework for building single-page applications. Its design is determined by simplicity, performance, and developer-first ergonomics.

## The @grainular namespace

**nord** is the primary reactive runtime in the @grainular namespace. There are other packages available, that integrate with the @grainular framework. (Grains, Forms, Routing, Custom Elements, ...etc). @grainular/nord is the primary reactive runtime to be used.

## Architectural overview

- Nord is a **pure** runtime framework. There is **no** build or compile or transpile step necessary
- It utilizes tagged templates to create markup
- Reactivity is granular, no rerendering or vdom exist
- Reactivity is open to all consumers, as long as they implement the `subscribable` interface
- Nords primary reactive primitive are grains, found in **@grainular/grains**
- Abstract access to the DOM is granted via a **Functional Directive** system
- Control flow is determined by **Structural Directives**

## Subscribables

Any developer is free to use any reactive primitive, as long as it implements the interface...

```ts
// subscribable
export type Subscribable<V> = {
    (): V;
    subscribe: (subscriber: (value: V) => void) => void | (() => void)
}
```

... or can be adapted to the interface using the `syncReactive` fn exposed by nord.

```ts
// sync reactive / rxjs example

import { syncReactive } from "@grainular/nord"
import { BehaviorSubject } from "rxjs"; 

const subject = new BehaviorSubject(0)
const count = syncReactive({
 get: () => subject.value,
 subscribe: (subscriber) => subject.subscribe(subscriber)
})

// Count does now implement the expected subscribable interface
```

## Mounting a Client Application

Any Nord application can be created using the `mount` fn exposed by nord when used in a browser runtime.

```ts
import { mount, html } from "@grainular/nord"; 

const App = () => html`Hello world`

mount(App, { to: document.querySelector('#app') })
```

The snippet above will render a simple `Hello world` text string to the `#app` element on the page.

## Rendering a Server Application

As Nord is fully SSR capable, any Application can be rendered to a string via the `renderToString` fn exposed by nord.

```ts
import { mount, html } from "@grainular/nord"; 

const App = () => html`Hello world`

// Render the application, and send the result
// to the client. There the application needs
// to be hydrated and replaced. (Destructive Hydration)
const html = renderToString(App)
```
