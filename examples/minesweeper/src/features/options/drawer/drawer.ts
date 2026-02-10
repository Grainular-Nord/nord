import { form } from '@grainular/forms';
import { html } from '@grainular/nord';
import { Button } from '../../../components/button/button.component';
import { clickOutside } from '../../../directives/click-outside.directive';
import { drawerState } from '../../../store/drawer-state';
import { gameState, mines, size } from '../../../store/game-state';
import { Range } from '../range/range';
import './drawer.css';

type OptionsModel = {
    size: number;
    mines: number;
};

export const Drawer = () => {
    const options = form<OptionsModel>({ size: size(), mines: mines() });

    return html`<aside class="drawer" data-expanded="${drawerState.expanded}">
        <div class="drawer-content" ${clickOutside(() => drawerState.close())}>
            ${Range({ control: options.controls.mines, formatter: (value) => `${value} Mines`, label: 'Mine Count', min: 1, max: 100 })}
            ${Range({ control: options.controls.size, formatter: (value) => `${value} R/C`, label: 'Board Size', min: 4, max: 12 })}
            ${Button({
                children: 'Start new Game',
                onClick: () => {
                    if (options.validate()) {
                        size.set(options.value().size);
                        mines.set(options.value().mines);
                        gameState.reset();
                    }
                },
            })}
            </div>
    </aside>`;
};
