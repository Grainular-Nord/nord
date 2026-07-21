import app from './app.css?inline';
import callout from './components/callout/callout.css?inline';
import codeBlock from './components/code-block/code-block.css?inline';
import codeGroup from './components/code-group/code-group.css?inline';
import componentHost from './components/component-host.css?inline';
import details from './components/details/details.css?inline';
import footer from './components/footer/footer.css?inline';
import header from './components/header/header.css?inline';
import navigationToggle from './components/header/navigation-toggle.css?inline';
import topNavigation from './components/header/top-navigation.css?inline';
import navigation from './components/navigation/navigation.css?inline';
import notFound from './components/not-found/not-found.css?inline';
import outline from './components/outline/outline.css?inline';
import pageLinks from './components/page-links/page-links.css?inline';
import icon from './components/primitives/icon.css?inline';
import iconButton from './components/primitives/icon-button.css?inline';
import search from './components/search/search.css?inline';
import docs from './layouts/docs.css?inline';
import page from './layouts/page.css?inline';

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
