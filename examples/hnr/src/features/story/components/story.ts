import { $each, $unsafeHtml, html } from '@grainular/nord';
import { CommentCard } from '../../comments/components/comment-card';
import type { Story } from '../models/story.model';
import { StoryDetailsBar } from './story-details-bar';

export type StoryProps = Story & {};

export const StoryCard = (props: StoryProps) => {
    return html`<div class="story-card">
        <hr />
        ${StoryDetailsBar({ ...props })}
        <div class="story-content">${$unsafeHtml(props.content ?? '')}</div>
        ${$each(() => props.comments).$as(CommentCard)}
    </div>`;
};
