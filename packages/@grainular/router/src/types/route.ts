import type { ComponentFragment } from '@grainular/nord';
import type { RouteGuard } from './route-guard';

export type Route = {
    path: `/${string}` | '**';
    guards?: RouteGuard[];
} & (
    | {
          component:
              | (() => ComponentFragment)
              | (() => Promise<ComponentFragment>)
              | (() => Promise<{ default: ComponentFragment }>);
          children?: never;
          redirect?: never;
      }
    | {
          children: Route[];
          component?: never;
          redirect?: never;
      }
    | {
          redirect: string;
          component?: never;
          children?: never;
      }
);
