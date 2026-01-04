import { html } from '@grainular/nord';
import './app.css';
import { ContactForm, ContactFormBody } from './components/contact-form.component';
import type { ContactModel } from './models/contact.model';

export const App = () => {
    const onContactSubmit = (data: ContactModel) => {
        alert(`You submitted your message successfully:\n---\n${JSON.stringify(data, null, 2)}`);
    };

    return html`
        <section class="min-h-screen w-full bg-slate-950 text-slate-200 flex items-center justify-center p-4">
            ${ContactForm({ render: ContactFormBody, submit: onContactSubmit })}
        </section>
    `;
};
