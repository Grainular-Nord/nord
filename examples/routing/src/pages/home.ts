import { html } from '@grainular/nord';

const Feature = ({ label, desc }: { label: string; desc: string }) => html`
    <div class="border border-slate-800 rounded-xl p-5 bg-slate-900 hover:border-slate-700 transition-colors">
        <div class="text-indigo-400 text-xs font-semibold uppercase tracking-widest mb-2">${label}</div>
        <div class="text-slate-400 text-sm leading-relaxed">${desc}</div>
    </div>
`;

export default () => {
    return html`
        <div class="flex flex-col gap-16">

            <div class="flex flex-col gap-6">
                <div class="inline-flex items-center gap-2 text-xs text-indigo-400 border border-indigo-500/20 bg-indigo-500/5 px-3 py-1.5 rounded-full w-fit">
                    <span class="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse"></span>
                    Navigation API · URLPattern · Zero deps
                </div>

                <h1 class="text-4xl font-bold tracking-tight text-slate-100 leading-tight">
                    A router built<br>
                    <span class="text-slate-500">for the platform.</span>
                </h1>

                <p class="text-slate-400 text-base leading-relaxed max-w-lg">
                    @grainular/router is a thin wrapper around the browser's own Navigation API.
                    No history shims, no custom matchers — just URLPattern, grains, and your components.
                </p>

                <div class="flex items-center gap-3">
                    <a href="/docs" class="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors shadow-lg shadow-indigo-500/20">
                        Read the docs →
                    </a>
                    <a href="/user/42" class="inline-flex items-center gap-2 border border-slate-700 hover:border-slate-500 text-slate-300 text-sm px-4 py-2.5 rounded-lg transition-colors">
                        See params →
                    </a>
                </div>
            </div>

            <div class="rounded-xl border border-slate-800 overflow-hidden shadow-xl">
                <div class="bg-slate-900 px-4 py-2.5 border-b border-slate-800 flex items-center gap-2">
                    <span class="w-3 h-3 rounded-full bg-slate-700"></span>
                    <span class="w-3 h-3 rounded-full bg-slate-700"></span>
                    <span class="w-3 h-3 rounded-full bg-slate-700"></span>
                    <span class="ml-2 text-xs text-slate-500">router.ts</span>
                </div>
                <pre class="bg-slate-950 p-6 text-sm leading-relaxed overflow-x-auto text-slate-300">export const { params, query, ...router } = createRouter('/', [
  {
    path: '/user/:id',
    component: () => import('./pages/user'),
    transition: slide(280),
    use: [
      pre(async (ctx) => isAuthenticated()),
    ],
  },
])</pre>
            </div>

            <div class="grid grid-cols-2 gap-4">
                ${Feature({ label: 'URLPattern', desc: "Path matching delegates to the browser's native URLPattern API. Constraints, wildcards, optional segments — all supported." })}
                ${Feature({ label: 'Grains', desc: 'params and query are reactive grains. Use .select<K>() to derive typed values with full autocomplete.' })}
                ${Feature({ label: 'Transitions', desc: 'Per-route view transitions via document.startViewTransition. Built-in fade, crossFade, slide, and scale helpers.' })}
                ${Feature({ label: 'Hooks', desc: 'pre and post hooks per route. Guards, redirects, analytics — any async function returning boolean | void.' })}
            </div>
        </div>
    `;
};
