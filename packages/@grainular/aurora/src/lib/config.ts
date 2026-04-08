import type { ComponentFragment } from '@grainular/nord';
import type { nordMarkdown } from 'vite-plugin-nord-md';

/**
 * Auxiliary type to describe social links that can be added
 * to the navigation bar.
 */
type SocialLink = {
    link: string;
    icon: 'github' | 'discord' | string;
};

type NavigationItem = {
    link: string;
    text: string;
};

export type AuroraConfig = {
    content?: string;
    site?: {
        /**
         * The title of the documentation site. This
         * will be shown after the page title, eg:
         * PageTitle | SiteTitle
         */
        title?: string;

        description?: string;

        social?: (SocialLink | ComponentFragment)[];

        logo?: string;

        navigation?: (NavigationItem | ComponentFragment)[];
    };
    markdown?: {
        components?: Parameters<typeof nordMarkdown>[0]['components'];
        plugins?: Parameters<typeof nordMarkdown>[0]['plugins'];
        transforms?: Parameters<typeof nordMarkdown>[0]['transform'];
    };
};
