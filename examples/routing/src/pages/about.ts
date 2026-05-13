import { html, on } from '@grainular/nord';
import { activatedRoute, navigate } from '../router';

export default () => {
    const { current } = activatedRoute;

    return html`
        <div>
            <h1>About Page</h1>
            <p>This is a simple about page.</p>
            <p>Current route: ${current}</p>
            <button ${on('click', () => navigate('/home'))}>
                Back to Home
            </button>
        </div>
    `;
};
