import { html } from '@grainular/nord';
import { Controls } from './controls';
import { Stats } from './stats';

export const GameInfo = () => {
    return html`
    <div class="flex flex-row items-center justify-between gap-8">
        ${Controls()}
        ${Stats()}
    </div>`;
};
