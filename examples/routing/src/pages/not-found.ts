import { html, on } from '@grainular/nord';
import { navigate } from '../router';

export default () => {
    return html`
        <div>
            <h1>404 - Page Not Found</h1>
            <p>The page you're looking for doesn't exist.</p>
            <button ${on('click', () => navigate('/home'))}>
                Go Home
            </button>
        </div>
    `;
};
