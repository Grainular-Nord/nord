import { html, on } from '@grainular/core';
import type { WritableGrain } from '@grainular/grains';
import { gameState } from '../grains/game-state.grain';
import type { PlayerSymbol } from '../grains/squares.grain';
import './square.css';

type SquareProps = { field: WritableGrain<null | PlayerSymbol> };

export const Square = ({ field }: SquareProps) => {
    const handleClick = () => {
        if (field() || gameState().ended) return;
        field.set(gameState().symbol);
    };

    return html`<button class="square" type="${field}" ${on('click', handleClick)}>${field}</button>`;
};
