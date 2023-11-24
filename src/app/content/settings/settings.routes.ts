import { Route } from '@angular/router';

import { SettingsComponent } from './settings/settings.component';

export const settingsRoutes: Route[] = [
  {
    path: '',
    component: SettingsComponent,
    children: [
      {
        path: 'profile',
        loadComponent: () => import('./settings/profile/profile.component').then((m) => m.ProfileComponent),
      },
      {
        path: 'site',
        loadComponent: () => import('./settings/site/site.component').then((m) => m.SiteComponent),
      },
      {
        path: 'grammar',
        loadComponent: () => import('./settings/grammar/grammar.component').then((m) => m.GrammarComponent),
      },
    ],
  },
];
