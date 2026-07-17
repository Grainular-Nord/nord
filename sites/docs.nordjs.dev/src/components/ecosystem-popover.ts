import { $each, html } from '@grainular/nord';
import './ecosystem-popover.css';

export type EcosystemItem = {
    description: string;
    href: string;
    name: string;
};

type EcosystemPopoverProps = {
    items: EcosystemItem[];
};

const ExternalLinkIcon = () => html`
    <svg class="nord-external-link-icon" aria-hidden="true" viewBox="0 0 24 24" fill="none">
        <path d="M15 3h6v6M10 14 21 3M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5" />
    </svg>
`;

export const EcosystemPopover = ({ items }: EcosystemPopoverProps) => html`
    <div class="nord-ecosystem">
        <button type="button" class="nord-ecosystem-trigger" popovertarget="nord-ecosystem-popover">
            Ecosystem
        </button>
        <div id="nord-ecosystem-popover" class="nord-ecosystem-popover" popover="auto">
            <p class="nord-ecosystem-label">Nørd ecosystem</p>
            <ul>
                ${$each(() => items)
                    .$withKey((item) => item.href)
                    .$as(
                        (item) => html`
                            <li>
                                <a href="${item.href}">
                                    <strong>${item.name}${ExternalLinkIcon()}</strong>
                                    <span>${item.description}</span>
                                </a>
                            </li>
                        `,
                    )}
            </ul>
        </div>
    </div>
`;
