import { inject } from '@angular/core';
import { Router } from '@angular/router';
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

export const getCardEffect = createEffect(
  (actions$ = inject(Actions), cardsService = inject(CardsService), router = inject(Router)) => {
    return actions$.pipe(
      ofType(cardsActions.getcard),
      tap(() => LoaderService.showLoader()),
      switchMap(({ deckId, cardId }) =>
        cardsService.getCard(deckId, cardId).pipe(
          map((card) => cardsActions.getcardSuccess({ card })),
          catchError(() => {
            return of(cardsActions.getcardFailure());
          }),
          finalize(() => {
            LoaderService.hideLoader();
            void router.navigate(['/cards/preview']);
          }),
        ),
      ),
    );
  },
  { functional: true },
);

export const createCardEffect = createEffect(
  (actions$ = inject(Actions), cardsService = inject(CardsService)) => {
    return actions$.pipe(
      ofType(cardsActions.createcard),
      tap(() => LoaderService.showLoader()),
      switchMap(({ deckId, decksCreateRequest }) =>
        cardsService.createCard(deckId, decksCreateRequest).pipe(
          map(() => cardsActions.createcardSuccess()),
          catchError(() => {
            return of(cardsActions.createcardFailure());
          }),
          finalize(() => LoaderService.hideLoader()),
        ),
      ),
    );
  },
  { functional: true },
);
