# Hej! Nice to see you

Welcome to Nørd — a modern JavaScript framework for building web UIs. You can read more about Nørd’s mission and philosophy [on the Tenets page.](./tenets.md)

<llm-exclude>
::: tip
Use the toggle in the navigation to switch between importing from npm or from a CDN. Examples using the CDN import can be copied directly into the browser and will run as expected. Since the examples are written in TypeScript, you may need to remove the types.
:::
</llm-exclude>

## Hello World

The snippet below shows a simple “Hello World” application. This is all that’s required to render HTML to the page.

```ts
import { html, mount } from "@grainular/nord";

const App = () => html`Hello World`;

mount(App, { to: document.querySelector("#main") });

// Or in one line

mount(() => html`Hello World`, { to: document.querySelector("#main") });
```

## Applications are built from components

Components are just functions that return `null` or a `fragment` created by the `html` tagged template function.

```ts
import { html, mount } from "@grainular/nord";

const Child = () => {
    return html`I'm a child component.`;
};

const App = () => {
    return html`<div>${Child()}</div>`;
};

mount(App, { to: document.querySelector("#main") });
```

## Components can receive props

You are free to pass state and functions down into child components. There are no limitations and no magic transformations. When you include a component in a template, you are simply calling the function you defined.

```ts
import { html, mount, type PureComponent } from "@grainular/nord";

// You can type props inline
const Child = ({ name }: { name: string }) => {
    return html`Hello ${name}`;
};

// Or use the `PureComponent<T>` type
const ChildTyped: PureComponent<{ name: string }> = ({ name }) => {
    return html`Hello ${name}`;
};

const App = () => {
    return html`<div>${Child({ name: "World" })}</div>`;
};

mount(App, { to: document.querySelector("#main") });
```

## Component functions only run once

Nørd evaluates a component during hydration and, after the first evaluation, never re-runs the component function.

```ts
import { html, mount } from "@grainular/nord";

const App = () => {
    console.log("Rendered");
    return html`Hello World`;
};

mount(App, { to: document.querySelector("#main") });

// Logs "Rendered" only once.
```

## Components can use grains for reactive values

```ts
import { html, mount, on } from "@grainular/nord";
import { grain } from "@grainular/grains";

const App = () => {
    const count = grain(0);
    const handleClick = () => count.set(count() + 1);

    return html`
        <button ${on("click", handleClick)}>
            ${count}
        </button>
    `;
};

mount(App, { to: document.querySelector("#main") });

// Renders: <button>0</button>
// After clicking:
// Renders: <button>1</button>
```

### Grains are not scoped — unless you scope them

```ts
import { html, mount, on } from "@grainular/nord";
import { grain } from "@grainular/grains";

// Can be used anywhere.
// Wherever this grain is used, it will update accordingly.
export const count = grain(0);

const App = () => {
    const handleClick = () => count.set(count() + 1);

    return html`
        <button ${on("click", handleClick)}>
            ${count}
        </button>
    `;
};

mount(App, { to: document.querySelector("#main") });
```

### State is passed via props

```ts
import { html, mount, on } from "@grainular/nord";
import { grain, type Grain } from "@grainular/grains";

type CounterProps = {
    count: Grain<number>;
};

const Counter = ({ count }: CounterProps) => {
    const increment = () => count.set(count() + 1);

    return html`
        <button ${on("click", increment)}>
            ${count}
        </button>
    `;
};

const App = () => {
    const count = grain(0);
    const reset = () => count.set(0);

    return html`
        ${Counter({ count })}
        <button ${on("click", reset)}>Reset</button>
    `;
};

mount(App, { to: document.querySelector("#main") });
```

## Children are just props

When passing children to components, no special rules apply. Anything that is a `fragment` or `string` can be used as a child (when using `PropsWithChildren`). Otherwise, you’re free to pass whatever you want.

```ts
import { html, mount, type PropsWithChildren } from "@grainular/nord";

const Child = ({ children }: PropsWithChildren) => {
    return html`I'm a child component. ${children}`;
};

const App = () => {
    return html`<div>${Child({ children: "Some text" })}</div>`;
};

mount(App, { to: document.querySelector("#main") });
```

## Comments are just HTML comments

Nothing special is required — just use standard HTML comment syntax.

```ts
import { html, mount } from "@grainular/nord";

const App = () => {
    return html`
        <div>
            <!-- Comment. Not visible in the DOM -->
        </div>
    `;
};

mount(App, { to: document.querySelector("#main") });
```

## Components can use directives to access the DOM

Directives are special functions inserted into templates that allow direct access to the DOM. For example, the `on` directive attaches event listeners to elements.

```ts
import { html, mount, on } from "@grainular/nord";

const App = () => {
    const handleClick = () => console.log("Clicked");

    return html`
        <button ${on("click", handleClick)}>Click me!</button>
    `;
};

mount(App, { to: document.querySelector("#main") });

// Clicking the button logs "Clicked" to the console.
```

## Structs handle control flow

Structs are a special kind of function that manipulate DOM nodes directly, rather than properties of a single node. This allows declarative control flow.

```ts
import { html, mount, $if } from "@grainular/nord";
import { grain } from "@grainular/grains";

const App = () => {
    const condition = grain(true);

    return html`
        <div>
            ${$if(condition, () => html`Boolean is true`)
                .$else(() => html`Boolean is false`)}
        </div>
    `;
};

mount(App, { to: document.querySelector("#main") });
```

## Async is not an issue

Handling promises is straightforward using the `$await` struct.

```ts
import { html, mount, $await } from "@grainular/nord";

export const App = () => {
    const promise = new Promise<string>((res) => {
        setTimeout(() => res("Hello World"), 2000);
    });

    return html`
        <div>
            ${$await(promise)
                .$then((data) => html`${data}`)
                .$catch((err) => html`${err.message}`)
                .$pending(() => html`Loading...`)}
        </div>
    `;
};

mount(App, { to: document.querySelector("main#app") });
```

## Lists are the final boss

Using the `$each` struct, lists and iterables — reactive or not — can be rendered efficiently.

```ts
import { html, mount, $each } from "@grainular/nord";
import { grain } from "@grainular/grains";

export const App = () => {
    const users = grain([
        { name: "A", age: 2 },
        { name: "B", age: 20 },
    ]);

    return html`
        <div>
            ${$each(() => users).$as(
                ({ name, age }) =>
                    html`<div>Name: ${name}, Age: ${age}</div>`
            )}
        </div>
    `;
};

mount(App, { to: document.querySelector("main#app") });
```

## If Nørd doesn’t have what you need, build it yourself

Nørd exposes `createDirective` and `createStruct`, allowing you to implement your own directives and structs. Anything you can’t express with the standard library can be built directly.

```ts
import { html, mount, createDirective } from "@grainular/nord";

// Creating a directive is simple and type-safe
const color = (value: string) =>
    createDirective((node) => {
        node.style.backgroundColor = value;
    });

export const App = () => {
    return html`
        <div ${color("red")}>I'm a red div</div>
        <div ${color("blue")}>I'm a blue div</div>
    `;
};

mount(App, { to: document.querySelector("main#app") });
```
