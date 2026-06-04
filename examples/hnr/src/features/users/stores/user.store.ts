import { grain, readonly } from '@grainular/grains';
import { navigate } from '@grainular/router';
import type { User } from '../models/user.model';

let controller: AbortController = new AbortController();
const store = grain<User | null>(null);
const fetchUser = async (id: string) => {
    store.set(null);
    controller.abort();
    controller = new AbortController();

    const response = await fetch(`https://hacker-news.firebaseio.com/v0/user/${id}.json`, {
        signal: controller.signal,
    });

    if (!response.ok) {
        return navigate(`/error/${response.status}`);
    }

    const story = await response.json();
    store.set(story);
};

export const userState = {
    state: {
        user: readonly(store),
    },
    actions: {
        fetchUser,
    },
};
