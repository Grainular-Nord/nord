import { type ComponentFragment, html, on } from '@grainular/nord';

type IconButtonProps = {
    label: string;
    icon: ComponentFragment;
    href?: string;
    external?: boolean;
    click?: () => void;
};

export const IconButton = ({ click, external = false, href, icon, label }: IconButtonProps) => {
    if (href && external) {
        return html`
            <a
                class="aurora-icon-button"
                href="${href}"
                aria-label="${label}"
                rel="noopener noreferrer"
                target="_blank"
            >
                ${icon}
            </a>
        `;
    }

    if (href) {
        return html`<a class="aurora-icon-button" href="${href}" aria-label="${label}">${icon}</a>`;
    }

    return html`
        <button type="button" class="aurora-icon-button" aria-label="${label}" ${on('click', () => click?.())}>
            ${icon}
        </button>
    `;
};
