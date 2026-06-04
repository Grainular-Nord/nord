import { grain } from '@grainular/grains';
import { $each, $if, $unsafeHtml, html, on } from '@grainular/nord';
import type { Comment } from '../models/comment.model';
import './comment-card.css';

export type CommentCardProps = Comment & {};

// A comment recursively renders new comments if it
// has child comments. This isn't really an issue, besides
// comments are static, so we only ever render them once
// with their meta data.
export const CommentCard = (props: CommentCardProps) => {
    const collapsed = grain(false);

    const handleToggleCollapse = (state: boolean) => {
        return (event: PointerEvent) => {
            event.stopPropagation();
            collapsed.set(state);
        };
    };

    return html`
        <div role="button" class="comment-card" id="${props.id}" data-level="${props.level}" ${on('click', handleToggleCollapse(true))}>
            <div class="comment-content">
                <div class="comment-details">
                    ${props.time_ago} by
                    <a class="secondary-link" href="/user/${props.user}" ${on('click', (e) => e.stopPropagation())}>${props.user}</a>
                    ${$if(collapsed).$then(() => {
                        return html`
                            <button ${on('click', handleToggleCollapse(false))}>
                                Show more
                            </button>`;
                    })}
                </div>
                <div data-collapsed="${collapsed}">
                    ${$unsafeHtml(props.content)}
                </div>
            </div>
            <div data-collapsed="${collapsed}">
                ${$each(() => props.comments).$as(CommentCard)}
            </div>
        </div>`;
};
