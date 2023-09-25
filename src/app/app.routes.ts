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
    loadChildren: () => import('./content/example-view/example.routes').then((m) => m.exampleRoutes),
  },
];
