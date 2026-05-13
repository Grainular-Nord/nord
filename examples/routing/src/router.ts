import { type Route, router } from '@grainular/router';

const routes: Route[] = [
    {
        path: '/',
        redirect: '/home',
    },
    {
        path: '/home',
        component: () => import('./pages/home'),
    },
    {
        path: '/about',
        component: () => import('./pages/about'),
    },
    {
        path: '/user/:id',
        component: () => import('./pages/user'),
    },
    {
        path: '/products',
        component: () => import('./pages/products'),
    },
    {
        path: '**',
        component: () => import('./pages/not-found'),
    },
];

export const { navigate, activatedRoute, link, $outlet } = router(routes);
