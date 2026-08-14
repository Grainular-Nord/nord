## 🎯 Tenets of Nord

Nørd is a minimal, reactive javascript library for building UI. It's main design ideas are simplicity, dx and staying as close to the browser as possible. Nørd therefore commits to a set of Tenets, that are non negotiable.

> More can always be said. The full documentation is available at [docs.nordjs.dev](https://docs.nordjs.dev)

---

### Philosophy

- **Nørd** is a JavaScript library for building reactive UI.
- **Nørds** runtime is dependency free, with 0 third party runtime dependencies.
- **Nørd** fully embraces TypeScript, but can be used without.
- **Nørd** does not require any build tools, but can still seamlessly integrate into modern setups.
- **Nørds** performance is not an afterthought, with effort spend on making it competitive.
- **Nørd** is small and focused. We aim for a sub 10kb runtime at all times, fully tree shakable.

---

### Architecture & Reactivity

- **Nørd** does not prescribe a reactive primitive. A `Subscribable` interface is exposed and needs to be fulfilled.
- **Nørd** does surgically update the DOM, there is no diffing, rerendering or virtual DOM.
- **Nørd** uses ordinary functions and closures to express state and UI.
- **Nørd** allows to declarative compose UI, but allows for imperative access to the DOM.
- **Nørd** uses browser features where possible, instead of reinventing the whell.

## Why Nørd?

Nørd tries to answer the question: What is the minimal set of primitives required to build reactive UI declaratively. Modern browsers offer many features that can be utilized to build a minimal runtime, and working with the browser means less JavaScript shipped. Nørd works with the browser, not against it.

## API Design

### Hello World

```ts
import { html, mount } from '@grainular/nord';

const App = () => html`Hello World`;

mount(App, { to: document.querySelector('#main') });

// Or in one line

mount(() => html`Hello World`, { to: document.querySelector('#main') });
```

### Components are just functions

```ts
import { html, mount } from '@grainular/nord';

const Child = () => {
    return html`I'm a child Component.`;
};

const App = () => {
    return html`<div>${Child()}</div>`;
};

mount(App, { to: document.querySelector('#main') });
```

### Components can receive props and use them in their template

```ts
import { html, mount } from '@grainular/nord';

const Child = ({ name }: { name: string }) => {
    return html`Hello ${name}`;
};

// OR typed
const Child: PureComponent<{ name: string }> = ({ name }) => {
    return html`Hello ${name}`;
};

const App = () => {
    return html`<div>${Child({ name: 'World' })}</div>`;
};

mount(App, { to: document.querySelector('#main') });
```

### Styles are (optionally) scoped

```ts
import { html, mount } from '@grainular/nord';
import { withStyles, css } from '@grainular/styled';

const Button = ({ label }) => {
    return withStyles(
        () => html`<button>${label}</button>`,
        () => css`
            /* Scoped to this component */
            button {
                background: red;
                color: white;
            }
        `,
    );
};

mount(() => Button({ label: 'Click Me' }), {
    to: document.querySelector('#app'),
});
```

### Components only render once

```ts
import { html, mount } from '@grainular/nord';

const App = () => {
    console.log('Rendered');
    return html`Hello World`;
};

mount(App, { to: document.querySelector('#main') });

// Logs `Rendered` only once.
```

### Components can use grains for reactive values

```ts
import { html, mount, on } from '@grainular/nord';
import { grain } from '@grainular/grains';

const App = () => {
    const count = grain(0); // inferred as `grain<number>`
    const handleClick = () => count.set(count() + 1);

    return html` <button ${on('click', handleClick)}>${count}</button>`;
};

mount(App, { to: document.querySelector('#main') });

// Renders a <button>0</button>
// After clicking
// Renders a <button>1</button>
```

### Grains are not scoped, unless you scope them

```ts
import { html, mount, on } from '@grainular/nord';
import { grain } from '@grainular/grains';

export const globalCount = grain(0); // Can be used anywhere

const App = () => {
    // Can be used inside the component and it's children
    const count = grain(0);
    const handleClick = () => count.set(count() + 1);

    return html` <button ${on('click', handleClick)}>${count}</button>`;
};

mount(App, { to: document.querySelector('#main') });

// Renders a <button>0</button>
// After clicking
// Renders a <button>1</button>
```

### State is passed via props

```ts
import { html, mount, on } from '@grainular/nord';
import { grain } from '@grainular/grains';

type CounterProps = {
    count: Grain<number>;
};

const Counter = ({ count }: CounterProps) => {
    const increment = () => count.set(count() + 1);

    return html` <button ${on('click', increment)}>${count}</button>`;
};

const App = () => {
    const count = grain(0); // Can be used inside the component and it's children
    const reset = () => count.set(0);

    return html` ${Counter({ count })}
        <button ${on('click', reset)}>Reset</button>`;
};

mount(App, { to: document.querySelector('#main') });
```

### Children are just props

```ts
import { html, mount } from '@grainular/nord';

const Child = ({ children }: PropsWithChildren) => {
    return html`I'm a child Component. ${children}`;
};

const App = () => {
    return html`<div>${Child({ children: 'Some Text' })}</div>`;
};

mount(App, { to: document.querySelector('#main') });
```

### Children can be fragments, too

```ts
import { html, mount } from '@grainular/nord';

const Child = ({ children }: PropsWithChildren) => {
    return html`I'm a child Component. ${children}`;
};

const App = () => {
    // You can define fragments whereever you want, they are normal values
    // that can be used throughout your app.
    const childTemplate = html`<div>Some markup</div>`;

    return html`<div>${Child({ children: childTemplate })}</div>`;
};

mount(App, { to: document.querySelector('#main') });
```

### Comments are just html comments

```ts
import { html, mount } from '@grainular/nord';

const App = () => {
    const condition = grain(true);

    return html` <div>
        <!-- Comment. Not visible in the DOM -->
    </div>`;
};

mount(App, { to: document.querySelector('#main') });
```

### Components can use directives to access DOM functionality

```ts
import { html, mount, on } from '@grainular/nord';

const App = () => {
    const handleClick = () => console.log('Clicked');

    return html` <button ${on('click', handleClick)}>0</button>`;
};

mount(App, { to: document.querySelector('#main') });

// Renders a <button>0</button>
```

### The `mounted` directive allows to execute code, after the node is connected

```ts
import { html, mounted, mount } from '@grainular/nord';

const App = () => {
    console.log('Rendered');

    return html` <div ${mounted((node) => console.log({ node }))}>Hello World</div>`;
};

mount(App, { to: document.querySelector('#main') });

// Logs `Rendered`
// Logs the node after the node is inserted and connected.
```

### Structs handle Controlflow

```ts
import { html, mount, $if } from '@grainular/nord';

const App = () => {
    const condition = grain(true);

    return html` <div>
        ${$if(condition)
            .$then(() => html`Boolean is true`)
            .$else(() => html`Boolean is False`)}
    </div>`;
};

mount(App, { to: document.querySelector('#main') });
```

### `$switch` can be used for more complex logic

```ts
import { html, mount, $switch } from '@grainular/nord';

export const App = () => {
    const count = grain(0);

    const type = grain<'a' | 'b' | 'c'>('a');

    return html` <div>
        ${$switch(type)
            .$case('a', () => html`<div>A</div>`)
            .$case('b', () => html`<div>B</div>`)
            .$case('c', () => html`<div>C</div>`)
            .$default('Not the right type')}
    </div>`;
};

mount(App, { to: document.querySelector('main#app') });
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
import { html, mount, mounted, ref, createRef } from '@grainular/nord';

export const App = () => {
    const div = createRef<HTMLDivElement>(); // creates a ref<HtmlElement> grain
    console.log(div.current); // logs null

    return html` <div ${ref(div)} ${mounted(() => console.log(div.current))}></div>`;
};

mount(App, { to: document.querySelector('main#app') });

// Logs: HTMLDivElement
```

### If nord doesn't have what you need, just build it yourself

```ts
import { html, mount, createDirective } from '@grainular/nord';

// Creating a directive your self is simple and typesafe
const color = (color: string) =>
    createDirective((node) => {
        node.style.backgroundColor = color;
    });

export const App = () => {
    return html` <div ${color('red')}>I'm a red div</div>
        <div ${color('blue')}>I'm a blue div</div>`;
};

mount(App, { to: document.querySelector('main#app') });
```

### Bring your own Observables

```ts
import { html, mount, syncReactive, on } from '@grainular/nord';
import { BehaviorSubject } from 'rxjs';

const subject = new BehaviorSubject(0);
const count = syncReactive({
    get: () => subject.value,
    subscribe: (subscriber) => subject.subscribe(subscriber),
});

export const App = () => {
    return html`<button ${on('click', () => subject.next(count() + 1))}>${count}</button>`;
};

mount(App, { to: document.querySelector('main#app') });
```
