import { html, on } from '@grainular/core';
import type { WritableGrain } from '@grainular/grains';
import { char } from '../grains/char.grain';
import { gameState } from '../grains/game-state.grain';
import './square.css';

type SquareProps = { field: WritableGrain<null | 'X' | 'O'> };

export const Square = ({ field }: SquareProps) => {
    const handleClick = () => {
        if (field() || gameState().ended) return;
        field.set(char());
    };

    return html`<button class="square" type="${field}" ${on('click', handleClick)}>${field}</button>`;
};
