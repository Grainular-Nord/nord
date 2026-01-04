import { $controlErrors, type Control } from '@grainular/forms';
import { html } from '@grainular/nord';

type InputProps<T> = {
    control: Control<T>;
    label: string;
    name: string;
    type: 'text' | 'number' | 'email' | 'password'; // Updated for valid HTML types
    placeholder: string;
};

export const Input = <T>({ control, label, name, type, placeholder }: InputProps<T>) => {
    return html`
    <label 
        for="${name}" 
        class="flex flex-col gap-1.5 w-full relative group 
               has-[.error]:[&_input]:border-red-500 has-[.error]:[&_input]:focus:ring-red-500/30 has-[.error]:[&_input]:bg-red-500/5 
               has-[.error]:[&_.input-label]:text-red-400"
    >
        <span class="input-label text-xs font-semibold uppercase tracking-wide text-slate-400 transition-colors group-focus-within:text-indigo-400">
            ${label}
        </span>
        <input 
            id="${name}" 
            name="${name}" 
            type="${type}" 
            placeholder="${placeholder}" 
            class="w-full bg-slate-800 border border-slate-700 text-slate-100 text-sm rounded-lg px-3.5 py-2.5 
                   placeholder-slate-500 shadow-sm transition-all duration-200 ease-in-out
                   focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:bg-slate-800/50"
            ${control.bind()}
        />
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
