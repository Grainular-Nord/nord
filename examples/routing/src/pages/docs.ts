import { html } from '@grainular/nord';

const Section = ({ title, body, code }: { title: string; body: string; code: string }) => html`
    <section class="flex flex-col gap-4">
        <h2 class="text-xs font-semibold tracking-widest text-indigo-400 uppercase">${title}</h2>
        <p class="text-slate-400 text-sm leading-relaxed">${body}</p>
        <pre class="bg-slate-900 border border-slate-800 rounded-lg p-4 text-sm text-slate-300 leading-relaxed overflow-x-auto">${code}</pre>
    </section>
`;

export default () => {
    return html`
        <div class="flex flex-col gap-14">

            <div class="flex flex-col gap-2">
                <p class="text-xs font-semibold text-slate-500 tracking-widest uppercase">Documentation</p>
                <h1 class="text-3xl font-bold tracking-tight text-slate-100">API Reference</h1>
                <p class="text-slate-400 text-sm leading-relaxed max-w-lg">
                    Everything the router exports. The surface is intentionally small.
                </p>
            </div>

            <div class="flex flex-col gap-10 border-l border-slate-800 pl-8">

                ${Section({
                    title: 'createRouter',
                    body: 'Creates a router instance scoped to a base path. Returns reactive params and query grains, plus internal router state for $outlet.',
                    code: `const { params, query, ...router } = createRouter('/', routes)`,
                })}

                ${Section({
                    title: 'params.select<K>',
                    body: 'Derives a typed value from the params grain. The generic narrows the record keys so the callback is properly typed — values are always strings.',
                    code: `const id  = params.select<'id'>(p => p.id)\nconst num = params.select<'id'>(p => Number(p.id))`,
                })}

                ${Section({
                    title: 'Hooks',
                    body: "pre receives the next route's context. post receives the current. Return false to block, void to pass through.",
                    code: `use: [\n  pre(async (ctx) => isAuthenticated()),\n  post(async (ctx) => !hasUnsavedChanges()),\n]`,
                })}

                ${Section({
                    title: 'Transitions',
                    body: 'Per-route view transitions defined per-route. Built-in helpers ship in a separate tree-shakeable entrypoint.',
                    code: `import { crossFade, slide, scale, fade } from '@grainular/router/transitions'\n\n{ transition: slide(280, 'left') }`,
                })}

                ${Section({
                    title: 'active',
                    body: "Directive that toggles a class when the element's href matches the current URL. Defaults to exact matching.",
                    code: `html\`<a href="/docs" \${active('is-active')}>Docs</a>\``,
                })}
            </div>
        </div>
    `;
};
