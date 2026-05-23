import { redirect, router } from '@grainular/router';
import { About } from './pages/about';
import { Home } from './pages/home';
import { NotFound } from './pages/not-found';
import { Products } from './pages/products';
import { User } from './pages/user';

// Create router with base path and object config
export const { navigate, link, $router, params, query } = router('/', {
    '/': () => redirect('/home'),
    '/home': () => Home,
    '/about': () => About,
    '/user/:id': () => User,
    '/products': () => Products,
    '**': () => NotFound,
});
