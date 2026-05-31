import { createRouter, crossFade, slide } from '@grainular/router';

export const { params, query, ...router } = createRouter('/', [
    {
        path: '/',
        component: () => import('./pages/home'),
    },
    {
        path: '/docs',
        component: () => import('./pages/docs'),
        transition: slide(400, 'left'),
    },
    {
        path: '/user/:id',
        component: () => import('./pages/user'),
        transition: slide(400, 'left'),
    },
    {
        path: '*',
        component: () => import('./pages/not-found'),
        transition: crossFade(250),
    },
]);
