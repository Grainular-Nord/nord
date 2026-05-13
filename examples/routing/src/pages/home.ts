import { html, on } from '@grainular/nord';
import { navigate } from '../router';

export default () => {
    return html`
        <div>
            <h1>Home Page</h1>
            <p>Welcome to the Nord Router example!</p>
            <p>This example demonstrates:</p>
            <ul>
                <li>Static route configuration</li>
                <li>Route parameters</li>
                <li>Active link styling</li>
                <li>Programmatic navigation</li>
                <li>Route redirects</li>
            </ul>
            <button ${on('click', () => navigate('/about'))}>
                Go to About (programmatic)
            </button>
        </div>
    `;
};
