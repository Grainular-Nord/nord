import { html } from '@grainular/nord';
import { Icon, icons } from './icon';
import './loader.css';

export const Loader = () => {
    return html`<div class="loader">
        ${Icon({ src: icons.loader })}
    </div>`;
};
