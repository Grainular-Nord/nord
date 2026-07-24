import { $each, html } from '@grainular/nord';
import { context } from '../../store/context';
import { renderComponentHost } from '../component-host';
import { NavigationToggle, navigationToggleDefinition } from './navigation-toggle';
import { SocialLink } from './social-link';
import { ThemeToggle, themeToggleDefinition } from './theme-toggle';
import { TopNavigation } from './top-navigation';

export const Header = () => {
    const { base = '/', navigation = [], social = [] } = context();
    return html`
        <header class="aurora-header">
            ${renderComponentHost(navigationToggleDefinition, NavigationToggle, {})}
            ${TopNavigation({ base, items: navigation })}
            <div class="aurora-header-actions">
                ${renderComponentHost(themeToggleDefinition, ThemeToggle, {})} ${$each(() => social).$as(SocialLink)}
            </div>
        </header>
    `;
};
