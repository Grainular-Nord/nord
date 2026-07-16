import { $each, html } from '@grainular/nord';
import { context } from '../../store/context';
import { renderComponentHost } from '../component-host';
import Search from '../search/search';
import { searchDefinition } from '../search/search-definition';
import { NavigationToggle, navigationToggleDefinition } from './navigation-toggle';
import { SocialLink } from './social-link';
import { ThemeToggle, themeToggleDefinition } from './theme-toggle';
import { TopNavigation } from './top-navigation';

export const Header = () => {
    const { base = '/', navigation = [], social = [] } = context();
    return html`
        <header class="aurora-header">
            ${renderComponentHost(navigationToggleDefinition, NavigationToggle, {})}
            ${renderComponentHost(searchDefinition, Search, { index: `${base}aurora-search.json`, base })}
            ${TopNavigation({ base, items: navigation })}
            <div class="aurora-header-actions">
                ${renderComponentHost(themeToggleDefinition, ThemeToggle, {})}
                ${$each(() => social).$as(SocialLink)}
            </div>
        </header>
    `;
};
