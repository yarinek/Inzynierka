import { Route } from '@angular/router';

import { ExercisesComponent } from './exercises/exercises.component';

export const exercisesRoutes: Route[] = [
  {
    path: '',
    component: ExercisesComponent,
  },
];
