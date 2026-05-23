import { html, on } from '@grainular/nord';
import { type RouteContext, route } from '@grainular/router';

export const User = route<'/user/:id'>(({ params, query, navigate }: RouteContext<'/user/:id'>) => {
    // params.select gives you type-safe access to :id
    const userId = params.select((p) => p.id);
    const tab = query.select((q) => q.tab || 'overview');

    return html`
		<div>
			<h1>User Profile</h1>
			<p>User ID: ${userId}</p>
			<p>Active Tab: ${tab}</p>
			<button ${on('click', () => navigate('/user/456', { search: { tab: 'settings' } }))}>
				View User 456
			</button>
		</div>
	`;
});
