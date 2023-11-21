import { Route } from '@angular/router';

import { ExerciseComponent } from './exercises/exercise/exercise.component';
import { ExercisesComponent } from './exercises/exercises.component';

export const exercisesRoutes: Route[] = [
  {
    path: '',
    component: ExercisesComponent,
  },
  {
    path: 'preview',
    component: ExerciseComponent,
  },
  {
    path: 'exercise',
    component: ExerciseComponent,
  },
];
