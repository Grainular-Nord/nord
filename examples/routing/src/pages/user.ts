import { type Grain, grain } from '@grainular/grains';
import { $each, html } from '@grainular/nord';
import { params } from '../router';

const StatCard = ({ label, value }: { label: string; value: Grain<string> }) => html`
    <div class="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col gap-1">
        <div class="text-xs font-semibold uppercase tracking-widest text-slate-500">${label}</div>
        <div class="text-2xl font-bold text-slate-100">${value}</div>
    </div>
`;

export default () => {
    const id = params.select<'id'>((p) => p.id);
    const parity = params.select<'id'>((p) => (Number(p.id) % 2 === 0 ? 'even' : 'odd'));

    return html`
        <div class="flex flex-col gap-10">

            <div class="flex flex-col gap-2">
                <p class="text-xs font-semibold text-slate-500 tracking-widest uppercase">Dynamic route · /user/:id</p>
                <h1 class="text-3xl font-bold tracking-tight text-slate-100">
                    User <span class="text-indigo-400">#${id}</span>
                </h1>
                <p class="text-slate-400 text-sm leading-relaxed max-w-lg">
                    Switch between users in the nav — the component stays mounted, params update surgically.
                </p>
            </div>

            <div class="grid grid-cols-3 gap-4">
                ${StatCard({ label: 'params.id', value: id })}
                ${StatCard({ label: 'parity', value: parity })}
                ${StatCard({ label: 'route', value: grain('/user/:id') })}
            </div>

            <div class="flex flex-col gap-3">
                <p class="text-xs font-semibold text-slate-500 tracking-widest uppercase">Switch user</p>
                <div class="flex flex-wrap gap-2">
                    ${$each(() => [1, 2, 3, 42, 99, 256]).$as(
                        (n) => html`
                        <a
                            href="/user/${n}"
                            class="px-3 py-1.5 text-sm border border-slate-700 rounded-lg text-slate-400 hover:border-indigo-500 hover:text-indigo-400 transition-colors"
                        >/user/${n}</a>
                    `,
                    )}
                </div>
            </div>
        </div>
    `;
};
