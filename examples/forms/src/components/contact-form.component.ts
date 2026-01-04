import { type Form, form, min, required } from '@grainular/forms';
import { type ComponentFragment, html, on } from '@grainular/nord';
import { categories } from '../models/category.model';
import { type ContactModel, initialContactModel } from '../models/contact.model';
import { textLength } from '../validators/text-length.validator';
import { Input } from './input.component';
import { Select } from './select.component';
import { Textarea } from './textarea.component';

type ContactFormProps = {
    render: (props: { form: Form<ContactModel> }) => ComponentFragment;
    submit: (formData: ContactModel) => void;
};

export const ContactForm = ({ render, submit }: ContactFormProps) => {
    const { validate, ...formProps } = form(initialContactModel, (schema) => {
        // Validate the names
        required(schema.name.first, { message: 'Please provide a first name' });
        required(schema.name.last, { message: 'Please provide a last name' });

        // Validate the age
        required(schema.age, { message: 'Required' });
        min(schema.age, { message: 'Needs to be at least 18', min: 18 });

        // Validate the message it self
        required(schema.message, { message: 'Required' });
        textLength(schema.message, { length: 500, message: 'Message cant exceed 500 characters.' });

        // And finally check if consent was given
        required(schema.consent, { message: 'Consent is required' });
    });

    const onSubmit = (event: SubmitEvent) => {
        event.preventDefault();
        if (validate()) return submit(formProps.value());
    };

    return html`
    <form ${on('submit', onSubmit)} class="w-full max-w-lg bg-slate-900 rounded-2xl shadow-xl p-8 border border-slate-800 flex flex-col gap-8">
        <div class="mb-2">
            <h2 class="text-3xl font-bold text-slate-100 tracking-tight">Say hi!</h2>
            <p class="text-slate-400 text-sm mt-1">We'd love to hear from you.</p>
        </div>
        
        ${render({ form: { ...formProps, validate } })}

        <button class="w-full py-3.5 px-4 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900">
            Submit Request
        </button>
    </form>`;
};

export const ContactFormBody = ({ form }: { form: Form<ContactModel> }) => {
    return html`
        <div class="flex flex-col gap-5">
            
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                ${Input({
                    control: form.controls.name.first,
                    label: 'First Name',
                    name: 'name',
                    type: 'text',
                    placeholder: 'Jane',
                })}
                 ${Input({
                     control: form.controls.name.last,
                     label: 'Last Name',
                     name: 'last-name',
                     type: 'text',
                     placeholder: 'Doe',
                 })}
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div class="sm:col-span-2">
                    ${Select({
                        control: form.controls.category,
                        options: [...categories],
                        label: 'Category',
                        name: 'category',
                    })}
                </div>
                <div class="sm:col-span-1">
                    ${Input({
                        control: form.controls.age,
                        label: 'Age',
                        name: 'age',
                        type: 'number',
                        placeholder: '25',
                    })}
                </div>
            </div>

            <div>
                ${Textarea({
                    control: form.controls.message,
                    label: 'Message',
                    name: 'message',
                    placeholder: "Tell us what's on your mind...",
                })}
            </div>

            <div>
                <label 
                    for="consent" 
                    class="group flex flex-row-reverse items-center justify-end gap-3 cursor-pointer select-none py-1"
                    data-isValid="${form.controls.consent.isValid}" 
                    data-touched="${form.controls.consent.touched}"
                >
                    <span class="text-sm text-slate-300 transition-colors group-data-[touched=true]:group-data-[isValid=false]:text-red-400">
                        I consent to the guidelines and privacy policy.
                    </span>

                    <input 
                        type="checkbox" 
                        id="consent"
                        class="peer appearance-none h-5 w-5 border border-slate-600 rounded bg-slate-800 
                               checked:bg-indigo-600 checked:border-indigo-600 
                               focus:ring-2 focus:ring-indigo-500/30 focus:outline-none 
                               transition-all duration-200 cursor-pointer
                               group-data-[touched=true]:group-data-[isValid=false]:border-red-500
                               group-data-[touched=true]:group-data-[isValid=false]:bg-red-500/10"
                        ${form.controls.consent.bind()} 
                    />
                    
                    <svg class="absolute w-5 h-5 pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity text-white stroke-current p-0.5" viewBox="0 0 24 24" fill="none" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                </label>
            </div>
        </div>
    `;
};
