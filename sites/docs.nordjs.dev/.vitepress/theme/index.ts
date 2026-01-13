import type { Theme } from 'vitepress';
import DefaultTheme from 'vitepress/theme';
// https://vitepress.dev/guide/custom-theme
import { h } from 'vue';
import PreferenceSwitch from './components/code-preference-switch.vue';
import PreferenceToggle from './components/code-preference-toggle.vue';
import './style.css';

export default {
    extends: DefaultTheme,
    Layout: () => {
        return h(DefaultTheme.Layout, null, {
            'sidebar-nav-before': () => h(PreferenceToggle),
        });
    },
    enhanceApp({ app, router, siteData }) {
        app.component('CodePreferenceSwitch', PreferenceSwitch);
    },
} satisfies Theme;
