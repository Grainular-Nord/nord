import app from './app.css' with { type: 'text' };
import callout from './components/callout/callout.css' with { type: 'text' };
import codeBlock from './components/code-block/code-block.css' with { type: 'text' };
import codeGroup from './components/code-group/code-group.css' with { type: 'text' };
import componentHost from './components/component-host.css' with { type: 'text' };
import details from './components/details/details.css' with { type: 'text' };
import footer from './components/footer/footer.css' with { type: 'text' };
import header from './components/header/header.css' with { type: 'text' };
import navigationToggle from './components/header/navigation-toggle.css' with { type: 'text' };
import topNavigation from './components/header/top-navigation.css' with { type: 'text' };
import navigation from './components/navigation/navigation.css' with { type: 'text' };
import notFound from './components/not-found/not-found.css' with { type: 'text' };
import outline from './components/outline/outline.css' with { type: 'text' };
import pageLinks from './components/page-links/page-links.css' with { type: 'text' };
import icon from './components/primitives/icon.css' with { type: 'text' };
import iconButton from './components/primitives/icon-button.css' with { type: 'text' };
import search from './components/search/search.css' with { type: 'text' };
import docs from './layouts/docs.css' with { type: 'text' };
import page from './layouts/page.css' with { type: 'text' };

export default [
    app,
    componentHost,
    callout,
    details,
    codeBlock,
    codeGroup,
    docs,
    page,
    header,
    navigationToggle,
    topNavigation,
    iconButton,
    icon,
    search,
    navigation,
    notFound,
    outline,
    pageLinks,
    footer,
].join('\n');
