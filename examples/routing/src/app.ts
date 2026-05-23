import { html } from '@grainular/nord';
import { $router, link } from './router';

export const App = () => {
    return html`
		<style>
			nav {
				padding: 1rem;
				background: #f0f0f0;
				display: flex;
				gap: 1rem;
			}
			nav a {
				padding: 0.5rem 1rem;
				background: white;
				text-decoration: none;
				color: #333;
				border-radius: 4px;
			}
			nav a.active {
				background: #4caf50;
				color: white;
			}
			main {
				padding: 2rem;
			}
		</style>
		<nav>
			<a href="/home" ${link({ activeClass: 'active' })}>Home</a>
			<a href="/about" ${link({ activeClass: 'active' })}>About</a>
			<a href="/user/123" ${link({ activeClass: 'active' })}>User 123</a>
			<a href="/products" ${link({ activeClass: 'active' })}>Products</a>
		</nav>
		<main>${$router}</main>
	`;
};
