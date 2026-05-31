import { html } from '@grainular/nord';
import { $outlet, active } from '@grainular/router';
import './app.css';
import { router } from './router';

const NavLink = ({ href, label }: { href: string; label: string }) => html`
    <a
        href="${href}"
        ${active('text-slate-100 border-b border-indigo-500')}
        class="text-sm text-slate-400 hover:text-slate-100 transition-colors px-3 py-1.5 border-b border-transparent"
    >${label}</a>
`;

export const App = () => {
    return html`
        <div class="min-h-screen bg-slate-950 text-slate-200">

            <header class="border-b border-slate-800 sticky top-0 z-50 bg-slate-950/80 backdrop-blur-sm">
                <div class="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between">
                    <a href="/" class="flex items-center gap-2.5">
                        <span class="w-5 h-5 rounded-sm bg-indigo-500"></span>
                        <span class="text-sm font-semibold tracking-tight text-slate-100">@grainular/router</span>
                    </a>
                    <nav class="flex items-center gap-1">
                        ${NavLink({ href: '/', label: 'Home' })}
                        ${NavLink({ href: '/docs', label: 'Docs' })}
                        ${NavLink({ href: '/user/42', label: 'User 42' })}
                        ${NavLink({ href: '/user/99', label: 'User 99' })}
                        ${NavLink({ href: '/nowhere', label: '404' })}
                    </nav>
                </div>
            </header>

            <main class="max-w-4xl w-full mx-auto px-6 py-16">
                ${$outlet({ for: router })}
            </main>

            <footer class="border-t border-slate-800 py-6">
                <div class="max-w-4xl mx-auto px-6 flex items-center justify-between">
                    <span class="text-xs text-slate-600">@grainular/router · Navigation API · URLPattern</span>
                    <span class="text-xs text-slate-600">v0.1.0</span>
                </div>
            </footer>
        </div>
    `;
};
