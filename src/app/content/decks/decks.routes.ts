import { Route } from '@angular/router';

import { DecksComponent } from './decks/decks.component';

export const decksRoutes: Route[] = [
  {
    path: '',
    component: DecksComponent,
  },
];
