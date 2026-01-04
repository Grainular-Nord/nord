import { $controlErrors, type Control } from '@grainular/forms';
import { derived, grain } from '@grainular/grains';
import { html } from '@grainular/nord';
import { trackTextLength } from '../directives/track-text-length.directive';

type TextareaProps<T> = {
    control: Control<T>;
    label: string;
    name: string;
    placeholder: string;
    maxLength?: number;
};

export const Textarea = <T>({ control, label, name, placeholder, maxLength = 500 }: TextareaProps<T>) => {
    // We track the text length of the text area as well
    // as if the length exceeds the specified max length
    const textLength = grain<number>(0);
    const textToLong = derived(textLength, (length) => length > maxLength);

    return html`
    <label 
        for="${name}" 
        class="flex flex-col gap-1.5 w-full relative group
               has-[.error]:[&_textarea]:border-red-500 has-[.error]:[&_textarea]:focus:ring-red-500/30 has-[.error]:[&_textarea]:bg-red-500/5 
               has-[.error]:[&_.input-label]:text-red-400"
    >
        <span class="input-label text-xs font-semibold uppercase tracking-wide text-slate-400 transition-colors group-focus-within:text-indigo-400">
            ${label}
        </span>
        
        <textarea 
            ${trackTextLength(textLength)}
            id="${name}" 
            name="${name}" 
            placeholder="${placeholder}" 
            class="w-full bg-slate-800 border border-slate-700 text-slate-100 text-sm rounded-lg px-3.5 py-2.5 
                   placeholder-slate-500 shadow-sm transition-all duration-200 ease-in-out
                   focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:bg-slate-800/50
                   min-h-30 resize-y"
            ${control.bind()}
        ></textarea>
        
        <span 
            class="self-end text-xs text-slate-500 transition-colors duration-200 
                   data-[toLong=true]:text-red-500 data-[toLong=true]:font-medium"
            data-toLong="${textToLong}"
        >
            ${textLength} / ${maxLength}
        </span>

        ${$controlErrors(
            control,
            (errors) => html`
            <span class="error text-xs font-medium text-red-400 -mt-4 animate-[slideDown_0.2s_ease-out]">
                ${errors}
            </span>
        `,
        )}
    </label>`;
};
