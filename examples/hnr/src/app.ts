import { createRef, html, ref } from '@grainular/nord';
import { $outlet } from '@grainular/router';
import './app.css';
import { router } from './router';
import { Shell } from './shared/components/shell';

export const App = () => {
    const viewTransitionRef = createRef<HTMLElement>();

    return html`${Shell({
        children: html`
            <main ${ref(viewTransitionRef)}>
                ${$outlet({ for: router, transitionElement: viewTransitionRef })}
            </main>`,
    })}`;
};
