import { derived } from '@grainular/grains';
import { $render, html, on } from '@grainular/nord';
import { themeStore } from '../stores/theme.store';

const sun = html`<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;
const moon = html`<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;

const ThemeToggle = () => {
    const { theme, toggle } = themeStore;

    return html`
        <button class="icon-btn" ${on('click', toggle)} aria-label="Toggle theme">
            ${$render(
                derived(theme, (theme) => {
                    return theme === 'dark' ? moon : sun;
                }),
            )}
        </button>
    `;
};

export const Navigation = () => {
    return html`
        <nav class="nav">
            <!-- 
                We provide a consistent home logo link
                to increase recognizability
            -->
            <a href="/" class="nav-logo">
                <img src="./logo-min.png" alt="Nord Logo"/>
                <span>Nørd</span>
            </a>

            <!-- 
                Additionally, a number of links
                to the documentation and playground
                as well as a theme toggle
            -->
            <ul class="nav-links">
                <li class="link">
                    <a href="https://docs.nordjs.dev" rel="noopener noreferrer">Docs.</a>
                </li>
                <li class="link">
                    <a href="https://playground.nordjs.dev" rel="noopener noreferrer">Playground.</a>
                </li>
                <li>${ThemeToggle()}</li>
                <li>
                    <a href="https://github.com/grainular-nord/nord" class="icon-btn" rel="noopener noreferrer" aria-label="Github Repository Link">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                    </a>
                </li>
            </ul>
        </nav>
    `.css`
    .nav {
        position: fixed; 
        height: var(--navigation-height); 
        display: flex; 
        align-items: center;
        justify-content: space-between;
        inset-inline: 0;
        padding-inline: max(2rem, (100% - 1044px) / 2);
        z-index: 10;

        & .nav-logo {
            display: flex; 
            align-items: center; 
            gap: 0.75rem; 
            font-weight: 800; 
            font-size: 1.3rem; 
            letter-spacing: -0.03em;
            text-decoration: none; 
            color: var(--text-main);

            & img {
                height: 2rem; 
                width: 2rem;
            }
        }

        & .nav-links {
            display: flex; 
            align-items: center; 
            gap: 0.25rem;
            list-style-type: none; 

            & .link {
                padding-inline: 0.5rem;
            }

            & a {
                text-decoration: none; 
                color: var(--text-sub); 
                font-size: 0.95rem; 
                font-weight: 500; 
                transition: color 0.2s;

                &:hover {
                    color: var(--text-main);
                }
            }
        }
    }`;
};
