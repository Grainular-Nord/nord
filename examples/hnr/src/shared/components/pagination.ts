import { derived, type Grain } from '@grainular/grains';
import { html, on } from '@grainular/nord';
import { Icon, icons } from './icon';
import { StickyContainer } from './sticky-container';

type PaginationProps = {
    current: Grain<number>;
    onNext: () => void;
    onPrev: () => void;
    hasNextPage: Grain<boolean>;
};

export const Pagination = ({ current, onNext, onPrev, hasNextPage }: PaginationProps) => {
    return html`
    ${StickyContainer({
        children: html`
            <button ${on('click', onPrev)} disabled="${derived(current, (current) => current <= 1)}">
                ${Icon({ src: icons.chevronLeft })}
                Previous
            </button>
            <span>Current Page: ${current}</span>
            <button ${on('click', onNext)} disabled="${derived(hasNextPage, (nextPage) => !nextPage)}"> 
                Next
                ${Icon({ src: icons.chevronRight })}
            </button>`,
    })}
    `;
};
