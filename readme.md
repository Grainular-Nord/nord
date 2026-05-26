## 🎯 Tenets of Nord

Nord is a lightweight, reactive JavaScript framework for building single-page applications. Its design is determined by simplicity, performance, and developer-first ergonomics.

---

### 🚀 Core Philosophy

- **Nord is a JavaScript library for building reactive single-page applications.**
- **Nord is dependency-free**, with zero third-party runtime dependencies.
- **Nord embraces TypeScript**, but does not require it.
- **Nord is a pure runtime framework**, and can run entirely without build tools.
- **Nord embraces modern DX tools**, like Vite, even though they are optional.
- **Nord is well tested**, with high coverage across its core primitives.
- **Nord is fast**, competitive with other frameworks

---

### ⚙️ Architecture & Reactivity

- **Nord uses grains (signals) as reactive primitives**, but does not enforce them. Any subscribable that exposes a `subscribe` function can be used.
- **Nord surgically updates DOM nodes** based on grain changes — no re-rendering, virtual DOM, or diffing involved.
- **Nord utilizes** a component-based architecture**, enabling composition through reactive building blocks.
- **Nord abstracts DOM logic**, but exposes it via directives for advanced control.

---

### 📦 Feature Integrations

- **Nord provides first-class modules** for HTTP, forms, routing, and internationalization (i18n).
- **Nord commits to a minimal core runtime**, under 10KB, extendable through optional modules.

---

### 🌐 Rendering & SSR

- **Nord is completely SSR ready**
- **Nord is performant by default**, utilizing stable templates and fine-grained updates to eliminate rerendering entirely.

---

### 🛠️ Developer Experience

- **Nord utilizes tagged template literals instead of JSX**, keeping it dependency-free and standards-aligned.
- **Nord provides modern devtools**, including a browser inspector and IDE extensions for an elevated development experience.

## API Design

### Hello World

```ts
import { html, mount } from "@grainular/nord";

const App = () => html`Hello World`

mount(App, { to: document.querySelector("#main") });

// Or in one line

mount(() => html`Hello World`, { to: document.querySelector('#main') })
```

### Applications are built from Components

```ts
import { html, mount } from "@grainular/nord";

const Child = () => {
 return html`I'm a child Component.`
}

const App = () => {
 return html`<div>${Child()}</div>`
}

mount(App, { to: document.querySelector("#main") });
```

### Components can receive props and use them in their template

```ts
import { html, mount } from "@grainular/nord";

const Child = ({ name }: { name: string }) => {
 return html`Hello ${name}`
}

// OR typed
const Child: PureComponent<{ name: string }> = ({name}) => {
  return html`Hello ${name}`
}

const App = () => {
 return html`<div>${Child({ name: 'World' })}</div>`
}

mount(App, { to: document.querySelector("#main") });
```

### Styles are scoped and simpe

```ts
import { html, mount } from "@grainular/nord"; 

const Button = ({ label }) => { 
 return html`<button>${label}</button>`
  .css`button { 
   background: red; 
   color: white; 
  } 
  /* Scoped to this component instance! */ `
};

mount(() => Button({ label: 'Click Me' }), { 
 to: document.querySelector("#app") 
});
```

### Components only render once

```ts
import { html, mount } from "@grainular/nord";

const App = () => {
 console.log('Rendered');
 return html`Hello World`
}

mount(App, { to: document.querySelector("#main") });

// Logs `Rendered` only once.
```

### Components can use grains for reactive values

```ts
import { html, mount, on } from "@grainular/nord";
import { grain } from "@grainular/grains"


const App = () => {
 const count = grain(0); // inferred as `grain<number>`
  const handleClick = () => count.set(count() + 1);

 return html`
  <button ${on('click', handleClick)}>
   ${count}
  </button>`
}

mount(App, { to: document.querySelector("#main") });

// Renders a <button>0</button>
// After clicking
// Renders a <button>1</button>
```

### Grains are not scoped, unless you scope them

```ts
import { html, mount, on } from "@grainular/nord";
import { grain } from "@grainular/grains"

export const globalCount = grain(0) // Can be used anywhere

const App = () => {
 // Can be used inside the component and it's children
 const count = grain(0); 
  const handleClick = () => count.set(count() + 1);

 return html`
  <button ${on('click', handleClick)}>
   ${count}
  </button>`
}

mount(App, { to: document.querySelector("#main") });

// Renders a <button>0</button>
// After clicking
// Renders a <button>1</button>
```

### State is passed via props

```ts
import { html, mount, on } from "@grainular/nord";
import {grain} from "@grainular/grains"

type CounterProps = {
 count: Grain<number>
}

const Counter = ({ count }: CounterProps) => {
 const increment = () => count.set(count() + 1);

 return html`
  <button ${on('click', increment)}>
   ${count}
  </button>`
}

const App = () => {
 const count = grain(0); // Can be used inside the component and it's children
 const reset = () => count.set(0)

 return html`
 ${Counter({ count })}
 <button ${on('click', reset)}>Reset</button>`
}

mount(App, { to: document.querySelector("#main") });
```

### Children are just props

```ts
import {html, mount} from "@grainular/nord";

const Child = ({ children }: PropsWithChildren) => {
 return html`I'm a child Component. ${children}`
}

const App = () => {
 return html`<div>${Child({children: 'Some Text'})}</div>`
}

mount(App, { to: document.querySelector("#main") });
```

### Children can be fragments, too

```ts
import {html, mount} from "@grainular/nord";

const Child = ({ children }: PropsWithChildren) => {
 return html`I'm a child Component. ${children}`
}

const App = () => {
 // You can define fragments whereever you want, they are normal values
 // that can be used throughout your app.
 const childTemplate = html`<div>Some markup</div>`

 return html`<div>${Child({ children: childTemplate })}</div>`
}

mount(App, { to: document.querySelector("#main") });
```

### Comments are just html comments

```ts
import { html, mount,  } from "@grainular/nord";

const App = () => {
 const condition = grain(true); 

 return html`
  <div>
   <!-- Comment. Not visible in the DOM -->
  </div>`
}

mount(App, { to: document.querySelector("#main") });
```

### Components can use directives to access DOM functionality

```ts
import {html, mount, on} from "@grainular/nord";


const App = () => {
 const handleClick = () => console.log('Clicked');

 return html`
  <button ${on('click', handleClick)}>
   0
  </button>`
}

mount(App, { to: document.querySelector("#main") });

// Renders a <button>0</button>
```

### The `mounted` directive allows to execute code, after the node is connected

```ts
import { html, mounted, mount } from "@grainular/nord";

const App = () => {
 console.log('Rendered');

 return html`
  <div ${mounted((node) => console.log({ node }))}>
   Hello World
  </div>`
}

mount(App, { to: document.querySelector("#main") });


// Logs `Rendered`
// Logs the node after the node is inserted and connected.
```

### Structs handle Controlflow

```ts
import { html, mount, $if } from "@grainular/nord";

const App = () => {
 const condition = grain(true); 

 return html`
  <div>
   ${$if(condition)
    .$then(() => html`Boolean is true`)
    .$else(() => html`Boolean is False`)}
  </div>`
}

mount(App, { to: document.querySelector("#main") });
```

### `$switch` can be used for more complex logic

```ts
import { html, mount, $switch } from "@grainular/nord"

export const App = () => {
 const count = grain(0)

 const type = grain<'a' | 'b' | 'c'>('a')

 return html`
  <div>
   ${$switch(type)
    .$case('a', () => html`<div>A</div>`)
    .$case('b', () => html`<div>B</div>`)
    .$case('c', () => html`<div>C</div>`)
    .$default('Not the right type')
   }
  </div>`
}

mount(App, { to: document.querySelector('main#app') })
```

### Async is not an issue

```ts
import { html, mount, $await } from "@grainular/nord"

export const App = () => {
 const promise = new Promise<string>((res) => {
  setTimeout(() => res('Hello World'), 2000)
 })

 return html`
  <div>
   ${$await(promise)
    .$then((data) => html`${data}`)
    .$catch((err) => html`${err.message}`)
    .$pending(() => html`Loading...`)
   )}
  </div>`
}

mount(App, { to: document.querySelector('main#app') })
```

### Lists are the final boss

```ts
import { html, mount, $each } from "@grainular/nord"

export const App = () => {
 const users = grain([{ name: 'A', age: 2 }, { name: 'B', age: 20 }]);

 return html`<div>
  ${$each(users)
   .$as(({name, age}, idx, arr) => html`
    <div>
     Name: ${name}, 
     Age: ${age}
    </div>`
   )
  )}
 </div>`
}

mount(App, { to: document.querySelector('main#app') })
```

### Ref's are easy

```ts
import { html, mount, mounted, ref, createRef } from "@grainular/nord"

export const App = () => {
 const div = createRef<HTMLDivElement>() // creates a ref<HtmlElement> grain
 console.log(div.current) // logs null
 
 return html`
  <div ${ref(div)} ${mounted(() => console.log(div.current))} ></div>`
}

mount(App, { to: document.querySelector('main#app') })

// Logs: HTMLDivElement
```

### If nord doesn't have what you need, just build it yourself

```ts
import { html, mount, createDirective } from "@grainular/nord"

// Creating a directive your self is simple and typesafe
const color = (color: string) => createDirective((node) => {
 node.style.backgroundColor = color; 
})

export const App = () => {
 return html`
  <div ${color('red')}>I'm a red div</div>
  <div ${color('blue')}>I'm a blue div</div>`
}

mount(App, { to: document.querySelector('main#app') })
```

### Bring your own Observables

```ts
import { html, mount, syncReactive, on } from "@grainular/nord"
import { BehaviorSubject } from "rxjs"; 

const subject = new BehaviorSubject(0)
const count = syncReactive({
 get: () => subject.value,
 subscribe: (subscriber) => subject.subscribe(subscriber)
})

export const App = () => {
 return html`<button ${on('click', () => subject.next(count() + 1))}>
  ${count}
 </button>`
}

mount(App, { to: document.querySelector('main#app') })

```

### Web Component Ready

```ts
import {createCustomElement} from "@grainular/custom-elements"
import {html} from "@grainular/nord"
import {grain} from "@grainular/grains"

const Counter = () => {
 const count = grain(0); 
 
 const handleClick = () => count.set(count() + 1)
 
 return html`
  <button ${on('click', handleClick)}>
   ${count}
  <button>`
}

export default createCustomElement(() => Counter(), { selector: 'nord-counter' })
```
