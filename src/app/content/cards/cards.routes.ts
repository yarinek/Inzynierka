import { Route } from '@angular/router';

import { CardComponent } from './card/card.component';
import { CardsComponent } from './cards/cards.component';

export const cardRoutes: Route[] = [
  {
    path: '',
    component: CardsComponent,
  },
  {
    path: 'activity',
    component: CardComponent,
  },
];
