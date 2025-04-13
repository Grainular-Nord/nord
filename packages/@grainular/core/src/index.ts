export { hydrateClient } from './application/hydrate-client';
export { mount } from './application/mount';
export type { ComponentProps } from './component/component-props';
export type { PureComponent } from './component/pure-component';
export { templateParser as html } from './component/template-parser';
export type { VoidComponent } from './component/void-component';
export { createDirective } from './directives/create-directive';
export { on } from './directives/on';
export { $each } from './structs/each.struct';
export { $if } from './structs/if.struct';

// type User = { name: string };

// const list = grain<User[]>([{ name: 'Sebastian' }]);
// const App = () => {
//     return html`
//         <div>List</div>
//         ${$each(list)
//             .$withKey((user) => user.name)
//             .$as((entry) => html`<div>${entry.name}</div>`)}
//     `;
// };

// mount(App, { to: document.querySelector('body') });
