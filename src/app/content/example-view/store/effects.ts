import { inject } from '@angular/core';
import { LoaderService } from '@app/shared/components/loader/loader.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap, tap } from 'rxjs';

import { ExampleService } from '../example.service';
import { exampleActions } from './actions';

export const getExampleEffect = createEffect(
  (actions$ = inject(Actions), service = inject(ExampleService)) => {
    return actions$.pipe(
      ofType(exampleActions.getExample),
      // Show loader after action is dispatched (If necessary)
      tap(() => LoaderService.showLoader()),
      switchMap(() => {
        return service.getExampleData().pipe(
          map((example) => exampleActions.getExampleSuccess({ example })),
          catchError(() => of(exampleActions.getExampleFailure())),
        );
      }),
      // Hide loader after action is dispatched (If necessary)
      tap(() => LoaderService.hideLoader()),
    );
  },
  { functional: true },
);
