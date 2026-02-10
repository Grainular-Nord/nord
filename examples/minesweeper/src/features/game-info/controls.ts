import { combined, derived } from '@grainular/grains';
import { html } from '@grainular/nord';
import { Button } from '../../components/button/button.component';
import { Icon, icons } from '../../components/icon/icon.component';
import { drawerState } from '../../store/drawer-state';
import { gameState } from '../../store/game-state';

export const Controls = () => {
    const status = derived(combined([gameState.state, gameState.result]), ([state, result]) => {
        return state === 'pending' || state === 'initialized'
            ? '😁'
            : state === 'stopped' && result
              ? '🥳'
              : state === 'stopped' && !result
                ? '😵'
                : '🤔';
    });

    return html`
    <div class="flex flex-row items-center gap-3">
        ${Button({
            onClick: () => drawerState.toggle(),
            children: Icon({ src: icons.gear, size: 16 }),
        })}
        ${Button({
            onClick: () => gameState.reset(),
            children: Icon({ src: icons.restart, size: 16 }),
        })}
        <div> ${status} </div>
    </div>
    `;
};
