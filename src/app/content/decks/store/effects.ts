import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { LoaderService } from '@app/shared/components/loader/loader.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, finalize, map, of, switchMap, tap } from 'rxjs';
import { DecksPage, DecksService } from 'src/http-client';

import { decksActions } from './actions';

export const getDecksEffect = createEffect(
  (actions$ = inject(Actions), decksService = inject(DecksService)) => {
    return actions$.pipe(
      ofType(decksActions.getdecks),
      tap(() => LoaderService.showLoader()),
      switchMap(({ pageIndex, pageSize }) =>
        decksService.listDecks(pageSize, pageIndex * pageSize).pipe(
          map(({ decks }: DecksPage) => decksActions.getdecksSuccess({ dataSource: decks ?? [] })),
          catchError(() => {
            return of(decksActions.getdecksFailure());
          }),
          finalize(() => LoaderService.hideLoader()),
        ),
      ),
    );
  },
  { functional: true },
);

export const createDeckEffect = createEffect(
  (actions$ = inject(Actions), decksService = inject(DecksService)) => {
    return actions$.pipe(
      ofType(decksActions.createdeck),
      tap(() => LoaderService.showLoader()),
      switchMap(({ decksCreateRequest }) =>
        decksService.createDeck(decksCreateRequest).pipe(
          map(() => decksActions.createdeckSuccess()),
          catchError(() => {
            return of(decksActions.createdeckFailure());
          }),
          finalize(() => LoaderService.hideLoader()),
        ),
      ),
    );
  },
  { functional: true },
);

export const navigateToCardsEffect = createEffect(
  (actions$ = inject(Actions), router = inject(Router)) => {
    return actions$.pipe(
      ofType(decksActions.setactivedeck),
      tap(() => {
        void router.navigateByUrl('/cards');
      }),
    );
  },
  { functional: true, dispatch: false },
);
