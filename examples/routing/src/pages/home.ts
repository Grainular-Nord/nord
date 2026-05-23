import { html, on } from '@grainular/nord';
import { type RouteContext, route } from '@grainular/router';

export const Home = route<'/home'>(({ navigate }: RouteContext<'/home'>) => {
    return html`
		<div>
			<h1>Home</h1>
			<p>Welcome to the Nord Router v3 example!</p>
			<button ${on('click', () => navigate('/user/123', { search: { tab: 'profile' } }))}>
				Go to User 123
			</button>
		</div>
	`;
});
