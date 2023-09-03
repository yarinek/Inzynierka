import { Route } from '@angular/router';

import { GlobalFeedComponent } from './global-feed/global-feed.component';

export const globalFeedRoutes: Route[] = [
  {
    path: '',
    component: GlobalFeedComponent,
  },
];
