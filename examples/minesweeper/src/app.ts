import { html } from '@grainular/nord';
import { GameField } from './features/game-field/game-field';
import { GameInfo } from './features/game-info/game-info';
import { Drawer } from './features/options/drawer/drawer';

export const App = () => {
    return html`
        ${Drawer()}
        <main class="bg-stone-900 p-6 rounded-lg border-2 border-stone-800/20 flex flex-col gap-3">
            ${GameInfo()}
            ${GameField()}
        </main>
    `;
};
