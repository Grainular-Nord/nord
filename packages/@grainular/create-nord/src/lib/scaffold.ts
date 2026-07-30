import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { templatesDir } from './package-root';

export type Dependency = { name: string; version: string; dev: boolean };

export type ScaffoldContext = {
    name: string;
    additionalDependencies: Dependency[][];
    useRolldown: boolean;
};

// A copy entry maps a path inside the templates directory to its
// destination inside the scaffolded project. Entries may be `false`
// to allow inline conditionals when building the list.
type Entry = [from: string, to: string] | false;

// Every template file is plain text, so all of them are copied through
// the same routine: read, substitute the `{{name}}` token, write.
const copyEntries = async (root: string, name: string, entries: Entry[]) => {
    let created = 0;
    for (const entry of entries) {
        if (!entry) continue;

        const [from, to] = entry;
        const content = (await readFile(join(templatesDir, from), 'utf-8')).replaceAll('{{name}}', name);
        const target = join(root, to);

        await mkdir(dirname(target), { recursive: true });
        await writeFile(target, content, 'utf-8');
        created++;
    }

    return created;
};

// The package.json is the only file that is adapted beyond token
// substitution: selected dependencies and the optional rolldown
// override are merged into the parsed template before writing.
const mergePackageJson = async (type: string, root: string, ctx: ScaffoldContext) => {
    const source = await readFile(join(templatesDir, type, 'package.json'), 'utf-8');
    const pkg = JSON.parse(source.replaceAll('{{name}}', ctx.name));
    const usesOxc = ctx.additionalDependencies.flat().some(({ name }) => name === 'oxfmt');

    if (ctx.useRolldown) {
        pkg.dependencies.vite = 'npm:rolldown-vite@7.2.5';
        pkg.overrides = { vite: 'npm:rolldown-vite@7.2.5' };
    }

    for (const { name, version, dev } of ctx.additionalDependencies.flat()) {
        (dev ? pkg.devDependencies : pkg.dependencies)[name] = version;
    }

    if (usesOxc) {
        Object.assign(pkg.scripts, {
            format: 'oxfmt . --write',
            'format:check': 'oxfmt . --check',
            lint: 'oxlint .',
            'lint:fix': 'oxlint --fix .',
        });
    }

    await mkdir(root, { recursive: true });
    await writeFile(join(root, 'package.json'), `${JSON.stringify(pkg, null, 4)}\n`, 'utf-8');
};

export const scaffoldBrowserTemplate = async (root: string, ctx: { name: string }) => {
    const created = await copyEntries(root, ctx.name, [
        ['common/_gitignore', '.gitignore'],
        ['common/vscode/extensions.json', '.vscode/extensions.json'],
        ['browser/index.html', 'index.html'],
        ['browser/app/index.js', 'app/index.js'],
        ['browser/app/logo.js', 'app/logo.js'],
        ['browser/app/style.css', 'app/style.css'],
        ['browser/app/nord-logo.svg', 'app/nord-logo.svg'],
    ]);

    return { created };
};

export const scaffoldViteTemplate = async (type: 'vite' | 'vite-ts', root: string, ctx: ScaffoldContext) => {
    const ext = type === 'vite-ts' ? 'ts' : 'js';
    const has = (match: string) => ctx.additionalDependencies.flat().some(({ name }) => name.includes(match));
    const [tailwind, prettier, oxc, lefthook] = [has('tailwindcss'), has('prettier'), has('oxfmt'), has('lefthook')];

    // Tailwind swaps the app & style files for pre-built tailwind
    // variants, and adds a vite config wiring up the plugin.
    const variant = tailwind ? '.tailwind' : '';
    const created = await copyEntries(root, ctx.name, [
        ['common/_gitignore', '.gitignore'],
        ['common/vscode/extensions.json', '.vscode/extensions.json'],
        ['common/_prettierignore', '.prettierignore'],
        prettier && ['common/_prettierrc', '.prettierrc'],
        oxc && ['common/_oxfmtrc.json', '.oxfmtrc.json'],
        oxc && ['common/_oxlintrc.json', '.oxlintrc.json'],
        lefthook && [`common/lefthook${oxc ? '.oxc' : prettier ? '.prettier' : ''}.yml`, 'lefthook.yml'],
        [`${type}/index.html`, 'index.html'],
        [`${type}/src/main.${ext}`, `src/main.${ext}`],
        [`${type}/public/nord-logo.svg`, 'public/nord-logo.svg'],
        type === 'vite-ts' && ['vite-ts/tsconfig.json', 'tsconfig.json'],
        [`${type}/src/app${variant}.${ext}`, `src/app.${ext}`],
        [`${type}/src/logo${variant}.${ext}`, `src/logo.${ext}`],
        [`${type}/src/style${variant}.css`, 'src/style.css'],
        tailwind && [`${type}/vite.config.tailwind.${ext}`, `vite.config.${ext}`],
    ]);

    await mergePackageJson(type, root, ctx);
    return { created: created + 1 };
};
