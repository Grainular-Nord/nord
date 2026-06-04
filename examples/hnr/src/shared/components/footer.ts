import { html } from '@grainular/nord';
import './footer.css';

export const Footer = () => {
    return html`<footer>
        &copy; ${new Date().getFullYear()} | <a href="https://github.com/iamsebastiandev" rel="noreferrer noopener">Sebastian Heinz</a> |
        <a href="https://nordjs.dev">Made with Nørd 💙</a>
    </footer>`;
};
