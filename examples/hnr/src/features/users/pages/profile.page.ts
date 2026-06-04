import { derived } from '@grainular/grains';
import { $if, $unsafeHtml, html, on } from '@grainular/nord';
import { Icon, icons } from '../../../shared/components/icon';
import { PageHeader } from '../../../shared/components/page-header';
import { StickyContainer } from '../../../shared/components/sticky-container';
import { userState } from '../stores/user.store';
import './profile.page.css';

export default () => {
    const { state } = userState;

    return html`
        ${PageHeader({
            label: derived(state.user, (user) => user?.id ?? ''),
            children: StickyContainer({
                children: html`
                <button ${on('click', () => navigation.back())}>
                    ${Icon({ src: icons.chevronLeft })}
                    Go Back
                </button>`,
            }),
        })}

    <div class="content">
        ${$if(derived(state.user, (user) => user !== null)).$then(() => {
            // biome-ignore lint/style/noNonNullAssertion: Again, we checked, but ts not getting it
            const { created, about, karma, submitted } = state.user()!;
            return html`
                <div class="clout-bar">
                    <span class="item">Created: ${new Date(created * 1000).toLocaleDateString()}</span>
                    <span class="item">
                        ${Icon({ src: icons.celebration, size: 16 })}
                        ${karma}</span>
                    <span class="item">
                        ${Icon({ src: icons.comment, size: 16 })}
                        ${submitted?.length ?? 0}
                    </span>
                </div>
                <div>
                    ${$unsafeHtml(about ?? '')}
                </div>
            `;
        })}
    </div>
    `;
};
