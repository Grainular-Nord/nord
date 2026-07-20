import { html, type PropsWithChildren } from '@grainular/nord';

type DetailsProps = PropsWithChildren<{
    title: string;
    name?: string;
    open?: boolean;
}>;

export const Details = ({ children, title, name = title }: DetailsProps) => {
    return html`
    <details class="aurora-details" name="${name}">
        <summary>
            <span>${title}</span>
            <svg class="aurora-details-icon" viewBox="0 0 24 24" aria-hidden="true">
                <path d="m6 9 6 6 6-6"></path>
            </svg>
        </summary>
        <div class="aurora-details-content">${children}</div>
    </details>
    `;
};
