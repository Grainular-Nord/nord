import { html } from '@grainular/nord';
import { route } from '@grainular/router';

export const About = route<'/about'>(() => {
    return html`
		<div>
			<h1>About</h1>
			<p>This is the about page.</p>
		</div>
	`;
});
