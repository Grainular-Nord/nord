import { type Fragment, html } from '@grainular/nord';
import type { AuroraConfig } from '../lib/config';
import { Docs } from './layouts/docs';
import { Page } from './layouts/page';
import { $pageTitle } from './structs/$page-title';

export type AppProps = {
    content: Fragment;
    meta: { title?: string; layout?: 'page' | string };
    config: AuroraConfig['site'];
};
export const App = ({ content, meta, config }: AppProps) => {
    console.log({ content, meta, config });
    // We want to find and extract the selected
    // layout from the frontmatter meta
    const layout = { page: Page, docs: Docs }[meta.layout ?? 'page'] ?? Page;

    return html`
        ${$pageTitle(meta.title)}
        <div class="application-shell">
            ${layout({ content, meta })}
        </div>
    `;
};
