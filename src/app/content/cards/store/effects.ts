import { inject } from '@angular/core';
import { LoaderService } from '@app/shared/components/loader/loader.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, finalize, map, of, switchMap, tap } from 'rxjs';
import { CardsPage, CardsService } from 'src/http-client';

import { cardsActions } from './actions';

export const getCardsEffect = createEffect(
  (actions$ = inject(Actions), cardsService = inject(CardsService)) => {
    return actions$.pipe(
      ofType(cardsActions.getcards),
      tap(() => LoaderService.showLoader()),
      switchMap(({ deckId, pageIndex, pageSize }) =>
        cardsService.listCards(deckId, pageSize, pageIndex * pageSize).pipe(
          map(({ cards }: CardsPage) => cardsActions.getcardsSuccess({ dataSource: cards ?? [] })),
          catchError(() => {
            return of(cardsActions.getcardsFailure());
          }),
          finalize(() => LoaderService.hideLoader()),
        ),
      ),
    );
  },
  { functional: true },
);

/* export const createDeckEffect = createEffect(
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
); */
