import { Route } from '@angular/router';

import { canActivateLoggedRoutesFn, canActivateNotLoggedRoutesFn } from './core/guards/auth.guard';

export const appRoutes: Route[] = [
  {
    path: 'register',
    canActivate: [canActivateNotLoggedRoutesFn],
    loadChildren: () => import('./content/auth/auth.routes').then((m) => m.registerRoutes),
  },
  {
    path: 'login',
    canActivate: [canActivateNotLoggedRoutesFn],
    loadChildren: () => import('./content/auth/auth.routes').then((m) => m.loginRoutes),
  },
  {
    path: '',
    canActivate: [canActivateLoggedRoutesFn],
    loadChildren: () => import('./content/globalFeed/globalFeed.routes').then((m) => m.globalFeedRoutes),
  },
  {
    path: 'feed',
    canActivate: [canActivateLoggedRoutesFn],
    loadChildren: () => import('./content/yourFeed/your-feed.routes').then((m) => m.yourFeedRoutes),
  },
  {
    path: 'tag/:slug',
    canActivate: [canActivateLoggedRoutesFn],
    loadChildren: () => import('./content/tagFeed/tagFeed.routes').then((m) => m.tagFeedRoutes),
  },
];
