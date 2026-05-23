import { html } from '@grainular/nord';
import { route } from '@grainular/router';

export const NotFound = route<'**'>(() => {
    return html`
		<div>
			<h1>404 - Not Found</h1>
			<p>The page you're looking for doesn't exist.</p>
		</div>
	`;
});
