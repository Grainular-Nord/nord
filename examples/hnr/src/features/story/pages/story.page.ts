import { derived } from '@grainular/grains';
import { $if, html, on } from '@grainular/nord';
import { Icon, icons } from '../../../shared/components/icon';
import { PageHeader } from '../../../shared/components/page-header';
import { StickyContainer } from '../../../shared/components/sticky-container';
import { StoryCard } from '../components/story';
import { storyState } from '../stores/story.store';

export default () => {
    const { state } = storyState;

    return html`
        ${PageHeader({
            label: derived(state.story, (story) => story?.title ?? ''),
            children: StickyContainer({
                children: html`
                    <button ${on('click', () => navigation.back())}>
                        ${Icon({ src: icons.chevronLeft })}
                        Go Back
                    </button>
                    <button ${on('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }))}>
                        ${Icon({ src: icons.chevronUp })}
                        To Top
                    </button>`,
            }),
        })}

        <div class="content">
            ${$if(derived(state.story, (story) => story !== null)).$then(() => {
                return html`${
                    // biome-ignore lint/style/noNonNullAssertion: We checked, but ts doesn't get it
                    StoryCard({ ...state.story()! })
                }`;
            })}
        </div>`;
};
