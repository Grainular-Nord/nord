import { createRouter, pre } from '@grainular/router';
import { storyState } from './features/story/stores/story.store.ts';
import { userState } from './features/users/stores/user.store.ts';

export const { query, params, ...router } = createRouter('/', [
    {
        path: '',
        component: () => import('./features/feed/pages/feed.page.ts'),
    },
    {
        path: '/feed/:feed',
        component: () => import('./features/feed/pages/feed.page.ts'),
    },
    {
        path: '/story/:storyId',
        component: () => import('./features/story/pages/story.page.ts'),
        use: [
            pre(async (ctx) => {
                if (ctx.params.storyId) {
                    await storyState.actions.fetchStory(Number(ctx.params.storyId));
                }

                return true;
            }),
        ],
    },
    {
        path: '/user/:userId',
        component: () => import('./features/users/pages/profile.page.ts'),
        use: [
            pre(async (ctx) => {
                if (ctx.params.userId) {
                    await userState.actions.fetchUser(ctx.params.userId);
                }

                return true;
            }),
        ],
    },
    {
        path: '/error/:code',
        component: () => import('./shared/pages/error.page.ts'),
    },
    {
        path: '*',
        component: () => import('./shared/pages/error.page.ts'),
    },
]);
