import { derived } from '@grainular/grains';
import { html } from '@grainular/nord';
import { params } from '../../router';

const messages = new Map<string, string>([
    ['404', '404 - Nothing here'],
    ['429', '429 - Too many Requests'],
    ['500', '500 - No clue what happened, sorry'],
    ['503', '503 - Server is sleepy, come back later'],
]);

export default () => {
    const error = params.select<'code'>((state) => state.code);
    const message = derived(error, (error) => messages.get(error) ?? '404 - Not Found');

    return html`
    <div class="error-page">
        <div class="error-code">${message}</div>
        <div>Oh no! Something went wrong.</div>
        <a href="/feed/news">Go home</a>
    </div>
    `;
};
