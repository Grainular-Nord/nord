import { html } from '@grainular/nord';
import { Aurora } from './components/aurora';
import { Hero } from './components/hero';
import { Navigation } from './components/navigation';

export const App = () => {
    return html`
        ${Navigation()}
        ${Aurora()}
        <main>
            ${Hero()}
        </main>
   `;
};
