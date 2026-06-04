import { grain, readonly } from '@grainular/grains';
import { navigate } from '@grainular/router';
import type { Story } from '../models/story.model';

let controller: AbortController = new AbortController();
const store = grain<Story | null>(null);
const fetchStory = async (id: number) => {
    store.set(null);
    controller.abort();
    controller = new AbortController();

    const response = await fetch(`https://node-hnapi.herokuapp.com/item/${id}`, { signal: controller.signal });
    if (!response.ok) {
        return navigate(`/error/${response.status}`);
    }
    const story = await response.json();
    store.set(story);
};

export const storyState = {
    state: {
        story: readonly(store),
    },
    actions: {
        fetchStory,
    },
};
