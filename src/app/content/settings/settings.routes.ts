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
    ],
  },
];
