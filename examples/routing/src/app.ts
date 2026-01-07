import { html } from '@grainular/nord';
import { $RouterOutlet, type Route, createRouter, routerLink } from '@grainular/router';

const Home = () => {
    return html`<div>Hello World, this is Home</div>`;
};

const Child = () => {
    return html`<div>This is a child route</div>`;
};

const routes: Route[] = [
    {
        path: '/',
        component: Home,
    },
    {
        path: '/child',
        component: () => Child(),
    },
];

const { router, navigate } = createRouter(routes);

export const App = () => {
    return html`
        <nav>
            <a ${routerLink()} href="./">Home</a>
            <a ${routerLink()} href="./child">Child</a>
        </nav>
        ${$RouterOutlet({ router })}
    `;
};
