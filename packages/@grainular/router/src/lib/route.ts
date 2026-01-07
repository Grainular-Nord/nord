import type { PureComponent } from '@grainular/nord';
import type { NavigatorFn, RouterStateSnapshot } from '..';

type GuardResult = Promise<boolean | ReturnType<NavigatorFn>>;
export type Guard = <T = unknown>(snapshot: RouterStateSnapshot<T>, navigator: NavigatorFn) => GuardResult;
export type Resolver = <R, T = unknown>(snapshot: RouterStateSnapshot<T>) => Promise<R | null>;

export type Route = {
    /**
     * The *path* for the route.
     * It should start with a forward slash ('/') followed by the specific path as a string.
     * This string defines the URL path that the route will match.
     *
     * Example: '/home', '/users/:userId'
     */
    path: `/${string}`;

    canActive?: Guard[];
    canDeactivate?: Guard[];
    resolve?: Record<PropertyKey, Resolver>;
} & (
    | {
          /**
           * Optional. The component to render when the route is matched.
           * Can be either a direct component instance or a function that returns a component asynchronously.
           * This property is used for rendering specific views/components when a route is matched.
           * It is mutually exclusive with `children` and `redirect`.
           */
          component: PureComponent | (() => Promise<PureComponent>);
          /**
           * This property is not available when 'component' is set in the route configuration.
           */
          children?: never;
          /**
           * This property is not available when 'children' or 'component' is set in the route configuration.
           */
          redirect?: never;
      }
    | {
          /**
           * An array of child routes for nested routing scenarios.
           * Each child route is a `Route` object, allowing for complex route structures with nested paths.
           * This property is mutually exclusive with `component` and `redirect`.
           *
           * Example usage:
           * children: [{ path: '/child', component: ChildComponent }]
           *
           */
          children: Route[];

          /**
           * This property is not available when 'children' or 'component' is set in the route configuration.
           */
          component?: never;
          /**
           * This property is not available when 'children' or 'component' is set in the route configuration.
           */
          redirect?: never;
      }
    | {
          /**
           * A path to redirect to when this route is matched.
           * Instead of rendering a component or handling child routes, this route will redirect to another path.
           * This property is mutually exclusive with `component` and `children`.
           *
           * Example usage:
           * redirect: '/other-route'
           */
          redirect: string;
          /**
           * This property is not available when 'children' or 'component' is set in the route configuration.
           */
          component?: never;
          /**
           * This property is not available when 'children' or 'component' is set in the route configuration.
           */
          children?: never;
      }
);
