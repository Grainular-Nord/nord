import { derived } from '@grainular/grains';
import { $each, $render, html, on } from '@grainular/nord';
import { active } from '@grainular/router';
import { feedTypes, getFeedLabel } from '../../features/feed/models/feed-type';
import { themeStore } from '../stores/theme.store';
import { Icon, icons } from './icon';
import './navigation.css';

const ThemeToggle = () => {
    const { theme, toggle } = themeStore;

    return html`
        <button ${on('click', toggle)} aria-label="Toggle theme" class="theme-toggle">
            ${$render(
                derived(theme, (theme) => {
                    return theme === 'dark' ? Icon({ src: icons.moon }) : Icon({ src: icons.sun });
                }),
            )}
        </button>
    `;
};

export const Navigation = () => {
    const items = feedTypes.map((type) => ({
        label: getFeedLabel(type),
        type,
    }));

    return html`
        <nav class="navigation">
            <ul>
                ${$each(() => items).$as((item) => {
                    return html`
                        <li class="navigation-item" >
                            <a href="/feed/${item.type}" ${active('link-active')}>${item.label}</a>
                        </li>
                    `;
                })}
            </ul>
            ${ThemeToggle()}
        </nav>
    `;
};
