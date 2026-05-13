import { derived } from '@grainular/grains';
import { html, on } from '@grainular/nord';
import { activatedRoute, navigate } from '../router';

export default () => {
    const { params, query } = activatedRoute;

    const userId = derived(params, (p) => p.id || 'unknown');
    const ref = derived(query, (q) => q.ref || 'none');

    return html`
        <div>
            <h1>User Profile</h1>
            <p>User ID: ${userId}</p>
            <p>Referrer: ${ref}</p>
            <div style="margin-top: 1rem;">
                <button ${on('click', () => navigate('/user/456', { search: { ref: 'button' } }))}>
                    View User 456
                </button>
                <button ${on('click', () => navigate('/user/789'))}>
                    View User 789
                </button>
            </div>
        </div>
    `;
};
