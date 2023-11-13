import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { ResourcesService } from 'src/http-client';

import { LoaderService } from '../components/loader/loader.service';
import { sharedActions } from './actions';

export const uploadFileEffect = createEffect(
  (actions$ = inject(Actions), resourcesService = inject(ResourcesService)) => {
    return actions$.pipe(
      ofType(sharedActions.uploadfile),
      tap(() => LoaderService.showLoader()),
      switchMap(({ file }) =>
        resourcesService.uploadResource(file).pipe(
          map(({ url }) => sharedActions.uploadfileSuccess({ url: url as string })),
          catchError(() => of(sharedActions.uploadfileFailure())),
        ),
      ),
    );
  },
  { functional: true },
);
