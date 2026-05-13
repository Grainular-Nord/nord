import { grain } from '@grainular/grains';
import { $each, html, on } from '@grainular/nord';
import { navigate } from '../router';

export default () => {
    const products = grain([
        { id: 1, name: 'Product A', price: 29.99 },
        { id: 2, name: 'Product B', price: 49.99 },
        { id: 3, name: 'Product C', price: 19.99 },
    ]);

    return html`
        <div>
            <h1>Products</h1>
            <div style="display: grid; gap: 1rem; margin-top: 1rem;">
                ${$each(products).$as(
                    (product) => html`
                    <div style="border: 1px solid #ddd; padding: 1rem; border-radius: 4px;">
                        <h3>${product.name}</h3>
                        <p>$${product.price}</p>
                        <button ${on('click', () => navigate(`/user/${product.id}`))}>
                            View Owner
                        </button>
                    </div>
                `,
                )}
            </div>
        </div>
    `;
};
