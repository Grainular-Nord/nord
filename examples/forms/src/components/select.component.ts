import { $controlErrors, type Control } from '@grainular/forms';
import { $each, html } from '@grainular/nord';

type SelectProps = {
    control: Control<string>;
    label: string;
    name: string;
    options: string[];
};

export const Select = ({ control, label, name, options }: SelectProps) => {
    return html`
    <label 
        for="${name}" 
        class="flex flex-col gap-1.5 w-full relative group
               has-[.error]:[&_select]:border-red-500 has-[.error]:[&_select]:focus:ring-red-500/30 has-[.error]:[&_select]:bg-red-500/5 
               has-[.error]:[&_.input-label]:text-red-400"
    >
        <span class="input-label text-xs font-semibold uppercase tracking-wide text-slate-400 transition-colors group-focus-within:text-indigo-400">
            ${label}
        </span>
        
        <div class="relative w-full">
            <select 
                id="${name}" 
                class="w-full bg-slate-800 border border-slate-700 text-slate-100 text-sm rounded-lg pl-3.5 pr-10 py-2.5 
                       appearance-none cursor-pointer shadow-sm transition-all duration-200 ease-in-out
                       focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:bg-slate-800/50"
                ${control.bind()}
            >
                ${$each(() => options).$as((option) => html`<option value="${option}">${option}</option>`)}
            </select>
            
            <svg 
                class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none transition-colors group-focus-within:text-indigo-500" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
            >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
        </div>

        ${$controlErrors(
            control,
            (errors) => html`
            <span class="error text-xs font-medium text-red-400 mt-0.5 animate-[slideDown_0.2s_ease-out]">
                ${errors}
            </span>
        `,
        )}
    </label>`;
};
