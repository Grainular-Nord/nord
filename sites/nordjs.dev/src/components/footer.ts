import { html } from '@grainular/nord';

export const Footer = () => {
    return html`<footer>
        &copy; ${new Date().getFullYear()} <a href="https://github.com/iamsebastiandev" rel="noreferrer noopener">Sebastian Heinz<a/>
    </footer>`;
};
