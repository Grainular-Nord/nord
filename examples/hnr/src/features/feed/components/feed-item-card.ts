import { derived } from '@grainular/grains';
import { html } from '@grainular/nord';
import { StoryDetailsBar } from '../../story/components/story-details-bar';
import type { FeedItem } from '../models/feed-item';
import { feedState } from '../stores/feed.store';
import './feed-item-card.css';
export type FeedItemCardProps = FeedItem & { rank: number };

export const FeedItemCard = (props: FeedItemCardProps) => {
    const rank = derived(feedState.state.currentPage, (page) => props.rank + 1 + (page - 1) * 30);

    return html`
    <a id="${props.id}" class="feed-item" href="/story/${props.id}"> 
        <h3>${rank}: ${props.title}</h3>
        ${StoryDetailsBar({ ...props })}
    </a>`;
};
