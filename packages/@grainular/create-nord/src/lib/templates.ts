import { app } from './file-factories/app';
import { gitIgnore } from './file-factories/git-ignore';
import { indexHtml } from './file-factories/index-html';
import { lefthookYml } from './file-factories/lefthook';
import { main } from './file-factories/main';
import { oxfmtrc } from './file-factories/oxfmtrc';
import { packageJson } from './file-factories/package-json';
import { prettierignore, prettierrc } from './file-factories/prettier';
import { viteConfig } from './file-factories/vite-config';

export type TemplateContext = {
    name: string;
    type: string;
    additionalDependencies: { name: string; version: string; dev: boolean }[][];
    useRolldown: boolean;
};
export type TemplateCreatorFn = (ctx: TemplateContext) => Promise<string[]>;
export const templates = new Map<string, Record<string, TemplateCreatorFn>>([
    [
        'browser',
        {
            '.gitignore': gitIgnore,
            'index.html': indexHtml('./app/index.js', './app/style.css'),
            'app/index.js': async () => {
                return [
                    'import { mount, html, on } from "http://unpkg.com/@grainular/nord";',
                    'import { grain } from "http://unpkg.com/@grainular/grains";',
                    '',
                    'function App() {',
                    '   const count = grain(0);',
                    '',
                    '   const increment = () => count.set(count() + 1);',
                    '',
                    '   return html`<button ${on("click", increment)}>${count}</button>`',
                    '}',
                    '',
                    'mount(App, { to: document.querySelector("#app") })',
                ];
            },
            'app/style.css': async () => {
                return [''];
            },
        },
    ],
    [
        'vite',
        {
            '.gitignore': gitIgnore,
            'package.json': packageJson,
            'index.html': indexHtml('./src/main.js', './src/style.css'),
            'vite.config.js': viteConfig(),
            'src/main.js': main('js'),
            'src/app.js': app(),
            'src/app.css': async () => [''],
            'src/style.css': async () => [''],
            '.prettierrc': prettierrc,
            '.prettierignore': prettierignore,
            'lefthook.yml': lefthookYml,
            '.oxfmtrc.json': oxfmtrc,
        },
    ],
    [
        'vite-ts',
        {
            '.gitignore': gitIgnore,
            'package.json': packageJson,
            'index.html': indexHtml('./src/main.ts', './src/style.css'),
            'vite.config.ts': viteConfig(),
            'src/main.ts': main('ts'),
            'src/app.ts': app(),
            'src/app.css': async () => [''],
            'src/style.css': async () => [''],
            '.prettierrc': prettierrc,
            '.prettierignore': prettierignore,
            'lefthook.yml': lefthookYml,
            '.oxfmtrc.json': oxfmtrc,
        },
    ],
]);
