import { $each, html } from '@grainular/nord';
import type { AuroraFooterConfig } from '../../../lib/config/config';
import { isComponentFragment } from '../../lib/is-component-fragment';
import { context } from '../../store/context';
import { SiteLink } from '../primitives/site-link';

export const Footer = () => {
    const { base = '/', footer } = context();
    if (footer === false) return null;
    if (isComponentFragment(footer)) return html`<footer class="aurora-footer">${footer}</footer>`;

    const config: AuroraFooterConfig =
        typeof footer === 'string' ? { text: footer } : (footer ?? { text: 'Built with Nørd and Aurora.' });
    const navigation = config.navigation ?? [];

    return html`
        <footer class="aurora-footer">
            <div class="aurora-footer-content">
                <span>${config.text ?? ''}</span>
                ${
                    navigation.length === 0
                        ? null
                        : html`
                          <nav class="aurora-footer-navigation" aria-label="Footer navigation">
                              ${$each(() => navigation).$as((item) => SiteLink(item, base))}
                          </nav>
                      `
                }
            </div>
        </footer>
    `;
};
