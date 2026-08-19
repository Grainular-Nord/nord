import type { ComponentFragment } from '@grainular/nord';
import type { UserConfig } from 'vite';
import type { nordMarkdown } from 'vite-plugin-nord-md';

export type AuroraLink = {
    link: string;
    text: string;
};

export type AuroraPageLinks = {
    prev?: AuroraLink;
    next?: AuroraLink;
};

export type AuroraSocialLink = {
    link: string;
    label: string;
    icon: 'github' | 'discord' | string | ComponentFragment;
};

export type AuroraFooterConfig = {
    text?: string | ComponentFragment;
    navigation?: (AuroraLink | ComponentFragment)[];
};

export type AuroraNavigationLink = {
    /** Selects this top-level item for routes at or below this root. */
    root?: string;
    /** Link rendered in the sidebar. */
    path: string;
    /** Human-readable label exposed to the application navigation. */
    label: string;
    /** Nested links or navigation groups rendered below this link. */
    children?: AuroraNavigationItem[];
};

export type AuroraNavigationGroup = {
    /** Selects this top-level item for routes at or below this root. */
    root?: string;
    /** Human-readable label for this navigation group. */
    label: string;
    /** Nested links or groups contained by this group. */
    children: AuroraNavigationItem[];
    path?: never;
};

export type AuroraNavigationItem = AuroraNavigationLink | AuroraNavigationGroup;

export type AuroraRuntimeNavigationItem = {
    label: string;
    path?: string;
    active: boolean;
    children: AuroraRuntimeNavigationItem[];
};

export type AuroraPageMeta = {
    title?: string;
    description?: string;
    robots?: string;
    layout?: string;
    /** Displays the UTC generation time for this page. Defaults to `false`. */
    lastUpdated?: boolean;
    links?: AuroraPageLinks;
};

export type AuroraPageConfig = {
    language?: string;
    themeColor?: string;
    /** Additional trusted markup appended to every document head. */
    head?: string | ComponentFragment;
};

export type AuroraStaticPage = {
    path: string;
    /** Explicit output file for pages such as the hosting-standard 404.html. */
    fileName?: string;
    markup: string;
    head: string;
    language: string;
    status?: number;
};

export type AuroraSearchEntry = {
    path: string;
    anchor: string;
    title: string;
    section?: string;
    text: string;
};

export type AuroraLayoutProps = {
    content: ComponentFragment;
    meta: AuroraPageMeta;
    /** UTC generation time for the current page, when `lastUpdated` is enabled. */
    lastUpdated?: string;
    /** Resolved region overrides, called by the layout in place of its defaults. */
    slots?: Record<string, AuroraComponentModule['default']>;
};

export type AuroraLayoutModule = {
    default: (props: AuroraLayoutProps) => ComponentFragment;
};

export type AuroraLayoutDefinition = {
    /** Layout name selected through Markdown frontmatter. */
    name: string;
    /** Lazily loads the layout's default export during static generation. */
    layout: () => Promise<AuroraLayoutModule>;
    /** Overrides for the regions this layout exposes, e.g. `sidebar`, `pageLinks`. */
    slots?: AuroraSlots;
};

export type AuroraComponentModule = {
    // Markdown erases component prop types at the runtime boundary.
    default: (props: any) => ComponentFragment;
};

export type AuroraComponentDefinition = {
    /** Component identifier used by Markdown directives and client hosts. */
    name: string;
    /** Whether Aurora should activate the statically rendered component on the client. */
    client: boolean;
    /** Lazily loads the component's default export. */
    component: () => Promise<AuroraComponentModule>;
    /** Optional presentation metadata for Aurora's generated host element. */
    host?: {
        class?: string;
    };
};

/** Overrides for named regions, keyed by region name — defined exactly like any other component. */
export type AuroraSlots = Record<string, Omit<AuroraComponentDefinition, 'name'>>;

export type AuroraContext = NonNullable<AuroraConfig['site']> & {
    /** Public link to the site root from the page currently being rendered. */
    base: string;
    routes: AuroraRuntimeNavigationItem[];
    search: boolean;
};

export type AuroraConfig = {
    /** Markdown files used to generate pages. Routes are inferred from file paths. */
    content?: string | string[];
    /** Static sidebar links. Top-level items can be grouped into route-specific views with `root`. */
    navigation?: AuroraNavigationItem[];
    /** Components available to Markdown. `client` controls browser activation. */
    components?: AuroraComponentDefinition[];
    /** Additional or replacement layouts selectable from Markdown frontmatter. */
    layouts?: AuroraLayoutDefinition[];
    /** Overrides for the header and footer rendered around every page. */
    slots?: AuroraSlots;
    /** Generates the search index and renders the built-in search island on the `docs` layout. Off by default. */
    search?: boolean;
    /** Generates the llms.txt files for the site. On by default */
    llms?: boolean;
    /** Document settings applied to every generated page. */
    page?: AuroraPageConfig;
    site?: {
        /** Absolute public site URL used for generated files such as sitemap.xml. */
        url?: string;

        /**
         * The title of the documentation site. This
         * will be shown after the page title, eg:
         * PageTitle | SiteTitle
         */
        title?: string;

        description?: string;

        /** Global social preview image, resolved against `url` and Vite's public base. */
        image?: string;

        /** Links rendered in the top navigation. */
        navigation?: (AuroraLink | ComponentFragment)[];

        /** Icon links rendered with the header actions. */
        social?: (AuroraSocialLink | ComponentFragment)[];

        /** Footer content, structured footer configuration, or `false` to omit it. */
        footer?: false | string | ComponentFragment | AuroraFooterConfig;

        logo?: string;
    };
    markdown?: {
        plugins?: Parameters<typeof nordMarkdown>[0]['rehypePlugins'];
        transforms?: Parameters<typeof nordMarkdown>[0]['transforms'];
    };
    /** Additional Vite configuration merged into Aurora's generated configuration. */
    vite?: UserConfig;
};

/** Provides type checking and autocomplete for an Aurora configuration. */
export const defineConfig = (config: AuroraConfig = {}): AuroraConfig => config;
