import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { selectActiveDeck } from '@app/content/decks/store/reducers';
import { LoaderService } from '@app/shared/components/loader/loader.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, combineLatest, filter, finalize, map, of, switchMap, tap, withLatestFrom } from 'rxjs';
import { Card, CardsPage, CardsService, ScheduleService } from 'src/http-client';

import { cardsActions } from './actions';
import { selectPreviewCard } from './reducers';

export const getCardsEffect = createEffect(
  (actions$ = inject(Actions), cardsService = inject(CardsService), store = inject(Store)) => {
    return actions$.pipe(
      ofType(cardsActions.getcards),
      withLatestFrom(store.select(selectActiveDeck)),
      tap(() => LoaderService.showLoader()),
      switchMap(([{ pageIndex, pageSize }, deck]) =>
        cardsService.listCards(String(deck?.id), pageSize, pageIndex).pipe(
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

export const redirectIfNoActiveDeckEffect = createEffect(
  (actions$ = inject(Actions), router = inject(Router)) => {
    return actions$.pipe(
      ofType(cardsActions.getcardsFailure),
      tap((): void => {
        void router.navigateByUrl('/decks');
      }),
    );
  },
  {
    functional: true,
    dispatch: false,
  },
);

export const getCardEffect = createEffect(
  (actions$ = inject(Actions), cardsService = inject(CardsService), router = inject(Router), store = inject(Store)) => {
    return actions$.pipe(
      ofType(cardsActions.getcard),
      withLatestFrom(store.select(selectActiveDeck)),
      tap(() => LoaderService.showLoader()),
      switchMap(([{ cardId }, deck]) =>
        cardsService.getCard(deck?.id as string, cardId).pipe(
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
  (actions$ = inject(Actions), cardsService = inject(CardsService), store = inject(Store)) => {
    return actions$.pipe(
      ofType(cardsActions.submitanswer),
      withLatestFrom(combineLatest([store.select(selectActiveDeck), store.select(selectPreviewCard)])),
      tap(() => LoaderService.showLoader()),
      switchMap(([{ answer }, [deck, card]]) =>
        cardsService.submitAnswerForCard(deck?.id as string, card?.id as string, { answer }).pipe(
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
  (actions$ = inject(Actions), scheduleService = inject(ScheduleService), store = inject(Store)) => {
    return actions$.pipe(
      ofType(cardsActions.startactivity),
      withLatestFrom(store.select(selectActiveDeck)),
      tap(() => LoaderService.showLoader()),
      switchMap(([, deck]) =>
        scheduleService.getScheduledCards(deck?.id as string).pipe(
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
  (actions$ = inject(Actions), cardsService = inject(CardsService), store = inject(Store)) => {
    return actions$.pipe(
      ofType(cardsActions.createcard),
      withLatestFrom(store.select(selectActiveDeck)),
      tap(() => LoaderService.showLoader()),
      switchMap(([{ cardCreateRequest }, deck]) =>
        cardsService.createCard(deck?.id as string, cardCreateRequest).pipe(
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

export const editCardEffect = createEffect(
  (actions$ = inject(Actions), cardsService = inject(CardsService), store = inject(Store)) => {
    return actions$.pipe(
      ofType(cardsActions.editcard),
      withLatestFrom(store.select(selectActiveDeck)),
      tap(() => LoaderService.showLoader()),
      switchMap(([{ cardId, cardUpdateRequest }, deck]) =>
        cardsService.patchCard(deck?.id as string, cardId, cardUpdateRequest).pipe(
          map(() => cardsActions.editcardSuccess()),
          catchError(() => {
            return of(cardsActions.editcardFailure());
          }),
          finalize(() => LoaderService.hideLoader()),
        ),
      ),
    );
  },
  { functional: true },
);

export const refreshViewAfterEditDeck = createEffect(
  (actions$ = inject(Actions)) => {
    return actions$.pipe(
      ofType(cardsActions.editcardSuccess),
      map(() => cardsActions.getcards({ pageIndex: 0, pageSize: 5 })),
    );
  },
  { functional: true },
);

export const deleteCardEffect = createEffect(
  (actions$ = inject(Actions), cardsService = inject(CardsService), store = inject(Store)) => {
    return actions$.pipe(
      ofType(cardsActions.deletecard),
      withLatestFrom(store.select(selectActiveDeck)),
      tap(() => LoaderService.showLoader()),
      switchMap(([{ cardId }, deck]) =>
        cardsService.deleteCard(deck?.id as string, cardId).pipe(
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
  (actions$ = inject(Actions)) => {
    return actions$.pipe(
      ofType(cardsActions.deletecardSuccess),
      map(() => cardsActions.getcards({ pageIndex: 0, pageSize: 5 })),
    );
  },
  { functional: true },
);
