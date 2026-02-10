import { type PropsWithChildren, html, on } from '@grainular/nord';

export type ButtonProps = PropsWithChildren<{
    onClick: (ev: PointerEvent) => void;
}>;

export const Button = ({ children, onClick }: ButtonProps) => {
    return html`
        <button ${on('click', onClick)} class="text-stone-400 hover:text-stone-200 inline-flex flex-row gap-2 cursor-pointer">
            ${children}
        </button>
    `;
};
