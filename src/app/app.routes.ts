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
  {
    path: 'settings',
    canActivate: [canActivateLoggedRoutesFn],
    loadChildren: () => import('./content/settings/settings.routes').then((m) => m.settingsRoutes),
  },
  {
    path: 'decks',
    canActivate: [canActivateLoggedRoutesFn],
    loadChildren: () => import('./content/decks/decks.routes').then((m) => m.decksRoutes),
  },
  {
    path: 'cards',
    canActivate: [canActivateLoggedRoutesFn],
    loadChildren: () => import('./content/cards/cards.routes').then((m) => m.cardRoutes),
  },
  {
    path: 'exercises',
    canActivate: [canActivateLoggedRoutesFn],
    loadChildren: () => import('./content/exercises/exercises.routes').then((m) => m.exercisesRoutes),
  },
];
