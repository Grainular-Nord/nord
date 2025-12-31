import type { WritableGrain } from '@grainular/grains';
import { html, on } from '@grainular/nord';
import { gameState } from '../grains/game-state.grain';
import type { PlayerSymbol } from '../grains/squares.grain';
import './square.css';

type SquareProps = { field: WritableGrain<null | PlayerSymbol> };

export const Square = ({ field }: SquareProps) => {
    const handleClick = () => {
        if (field() || gameState().ended) return;
        field.set(gameState().symbol);
    };

    return html`<button class="square" data-player="${field}" ${on('click', handleClick)}>${field}</button>`;
};
