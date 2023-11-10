import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { selectActiveDeckId } from '@app/content/decks/store/reducers';
import { LoaderService } from '@app/shared/components/loader/loader.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, filter, finalize, map, of, switchMap, tap, withLatestFrom } from 'rxjs';
import { Card, CardsPage, CardsService, ScheduleService } from 'src/http-client';

import { cardsActions } from './actions';
import { selectPreviewCard } from './reducers';

export const getCardsEffect = createEffect(
  (actions$ = inject(Actions), cardsService = inject(CardsService)) => {
    return actions$.pipe(
      ofType(cardsActions.getcards),
      tap(() => LoaderService.showLoader()),
      switchMap(({ deckId, pageIndex, pageSize }) =>
        cardsService.listCards(deckId, pageSize, pageIndex).pipe(
          map(({ cards, total }: CardsPage) =>
            cardsActions.getcardsSuccess({ dataSource: cards ?? [], totalElements: total ?? 0 }),
          ),
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

export const submitAnswerEffect = createEffect(
  (actions$ = inject(Actions), cardsService = inject(CardsService)) => {
    return actions$.pipe(
      ofType(cardsActions.submitanswer),
      tap(() => LoaderService.showLoader()),
      switchMap(({ deckId, cardId, answer }) =>
        cardsService.submitAnswerForCard(deckId, cardId, { answer }).pipe(
          map(({ cardToReview, total }) => {
            if (!total) {
              return cardsActions.submitanswerFailure();
            }
            return cardsActions.submitanswerSuccess({ card: cardToReview as Card });
          }),
          catchError(() => {
            return of(cardsActions.getcardFailure());
          }),
          finalize(() => {
            LoaderService.hideLoader();
          }),
        ),
      ),
    );
  },
  { functional: true },
);

export const startActivityEffect = createEffect(
  (actions$ = inject(Actions), scheduleService = inject(ScheduleService)) => {
    return actions$.pipe(
      ofType(cardsActions.startactivity),
      tap(() => LoaderService.showLoader()),
      switchMap(({ deckId }) =>
        scheduleService.getScheduledCards(deckId).pipe(
          map(({ cardToReview, total }) => {
            if (!total) {
              return cardsActions.startactivityFailure();
            }
            return cardsActions.startactivitySuccess({ card: cardToReview as Card });
          }),
          catchError(() => {
            return of(cardsActions.startactivityFailure());
          }),
          finalize(() => {
            LoaderService.hideLoader();
          }),
        ),
      ),
    );
  },
  { functional: true },
);

export const redirectAfterStartActivityEffect = createEffect(
  (actions$ = inject(Actions), router = inject(Router)) => {
    return actions$.pipe(
      ofType(cardsActions.startactivitySuccess),
      tap((): void => {
        void router.navigateByUrl('/cards/activity');
      }),
    );
  },
  {
    functional: true,
    dispatch: false,
  },
);

export const redirectAfterSubmitFailureEffect = createEffect(
  (actions$ = inject(Actions), router = inject(Router)) => {
    return actions$.pipe(
      ofType(cardsActions.submitanswerFailure),
      tap((): void => {
        void router.navigateByUrl('/cards');
      }),
    );
  },
  {
    functional: true,
    dispatch: false,
  },
);

export const redirectIfNoActiveCardEffect = createEffect(
  (actions$ = inject(Actions), router = inject(Router), store = inject(Store)) => {
    return actions$.pipe(
      ofType(cardsActions.redirectifnull),
      withLatestFrom(store.select(selectPreviewCard)),
      filter(([, card]) => !card),
      tap((): void => {
        void router.navigateByUrl('/cards');
      }),
    );
  },
  {
    functional: true,
    dispatch: false,
  },
);

export const createCardEffect = createEffect(
  (actions$ = inject(Actions), cardsService = inject(CardsService)) => {
    return actions$.pipe(
      ofType(cardsActions.createcard),
      tap(() => LoaderService.showLoader()),
      switchMap(({ deckId, decksCreateRequest }) =>
        cardsService.createCard(deckId, decksCreateRequest).pipe(
          map((card) => cardsActions.createcardSuccess({ card })),
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

export const redirectAfterCreateCard = createEffect(
  (actions$ = inject(Actions), router = inject(Router)) => {
    return actions$.pipe(
      ofType(cardsActions.createcardSuccess),
      tap(() => void router.navigateByUrl('/cards/preview')),
    );
  },
  { functional: true, dispatch: false },
);

export const deleteCardEffect = createEffect(
  (actions$ = inject(Actions), cardsService = inject(CardsService), store = inject(Store)) => {
    return actions$.pipe(
      ofType(cardsActions.deletecard),
      withLatestFrom(store.select(selectActiveDeckId)),
      tap(() => LoaderService.showLoader()),
      switchMap(([{ cardId }, deckId]) =>
        cardsService.deleteCard(deckId, cardId).pipe(
          map(() => cardsActions.deletecardSuccess()),
          catchError(() => {
            return of(cardsActions.deletecardFailure());
          }),
          finalize(() => LoaderService.hideLoader()),
        ),
      ),
    );
  },
  { functional: true },
);

export const refreshViewAfterDeleteDeck = createEffect(
  (actions$ = inject(Actions), store = inject(Store)) => {
    return actions$.pipe(
      ofType(cardsActions.deletecardSuccess),
      withLatestFrom(store.select(selectActiveDeckId)),
      map(([, deckId]) => cardsActions.getcards({ deckId, pageIndex: 0, pageSize: 5 })),
    );
  },
  { functional: true },
);
