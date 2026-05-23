import { html } from '@grainular/nord';
import { type GuardContext, type RouteContext, route } from '@grainular/router';

export const Products = route<'/products'>(
    ({ link }: RouteContext<'/products'>) => {
        return html`
			<div>
				<h1>Products</h1>
				<p>This route has a guard that logs access.</p>
				<a href="/about" ${link({ activeClass: 'active' })}>Back to About</a>
			</div>
		`;
    },
    {
        run: 'pre',
        use: (ctx: GuardContext) => {
            console.log('Accessing products page from:', ctx.from?.path || 'initial');
        },
    },
);
