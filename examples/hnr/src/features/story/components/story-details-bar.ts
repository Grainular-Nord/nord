import { $if, html } from '@grainular/nord';
import { Icon, icons } from '../../../shared/components/icon';
import type { Story } from '../models/story.model';
import './story-details-bar.css';

export type StoryDetailBarProps = Omit<Story, 'comments'> & {};
export const StoryDetailsBar = (props: StoryDetailBarProps) => {
    return html`
    <div class="detail-bar">
        ${$if(() => !!props.domain).$then(() => {
            return html`
                <a class="detail accent" href="https://${props.domain}">
                    ${props.domain}
                </a> 
            `;
        })}
        <span class="detail">
            ${Icon({ src: icons.comment, size: 16 })}
            ${props.comments_count}
        </span>
        ${$if(() => !!props.points).$then(() => {
            return html`
                <span class="detail">
                    ${Icon({ src: icons.heart, size: 16 })}
                    ${props.points}
                </span> 
            `;
        })}
        ${$if(() => !!props.user).$then(() => {
            return html`
            <span class="detail">
                ${Icon({ src: icons.user, size: 16 })}
                <a class="secondary-link" href="/user/${props.user}">${props.user}</a>
            </span> 
        `;
        })}
        <span class="detail">
            ${props.time_ago}
        </span>
    </div>`;
};
