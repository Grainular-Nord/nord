import { html } from '@grainular/nord';

export default () => {
    return html`
        <div class="flex flex-col items-center justify-center min-h-64 gap-6 text-center">

            <div class="flex flex-col gap-1">
                <div class="text-8xl font-bold text-slate-800 select-none">404</div>
                <div class="text-slate-500 text-sm">no route matched this path</div>
            </div>

            <div class="border border-slate-800 rounded-lg px-5 py-3 text-sm text-slate-500 bg-slate-900/50">
                router.match(<span class="text-indigo-400">"${window.location.pathname}"</span>) → <span class="text-red-400">null</span>
            </div>

            <a
                href="/"
                class="text-sm text-slate-400 hover:text-slate-100 transition-colors border-b border-slate-700 hover:border-slate-400 pb-0.5"
            >
                ← back to home
            </a>
        </div>
    `;
};
