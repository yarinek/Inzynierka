import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { selectActiveDeck } from '@app/content/decks/store/reducers';
import { LoaderService } from '@app/shared/components/loader/loader.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import {
  catchError,
  combineLatest,
  concatMap,
  filter,
  finalize,
  forkJoin,
  from,
  map,
  Observable,
  of,
  switchMap,
  tap,
  toArray,
  withLatestFrom,
} from 'rxjs';
import {
  Card,
  CardContentElement,
  CardContentElementType,
  CardsPage,
  CardsService,
  ResourcesService,
  ScheduleService,
} from 'src/http-client';

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
  (
    actions$ = inject(Actions),
    cardsService = inject(CardsService),
    resourcesService = inject(ResourcesService),
    store = inject(Store),
  ) => {
    return actions$.pipe(
      ofType(cardsActions.createcard),
      withLatestFrom(store.select(selectActiveDeck)),
      tap(() => LoaderService.showLoader()),
      switchMap(([{ cardCreateRequest }, deck]) => {
        // Define a function to handle file upload for an array of content elements
        const uploadFiles = (contentElements: Array<CardContentElement>): Observable<CardContentElement[]> =>
          from(contentElements).pipe(
            concatMap((contentElement) => {
              if (contentElement.type !== CardContentElementType.Text) {
                // Assuming uploadFile returns an Observable<string>

                return resourcesService.uploadResource(contentElement.content as unknown as File).pipe(
                  map((res) => ({ ...contentElement, content: res.url as string })),
                  catchError(() => of(contentElement)), // Handle error if needed
                );
              } else {
                return of(contentElement);
              }
            }),
            toArray(), // Collect all results back into an array
          );

        return forkJoin({
          front: uploadFiles(cardCreateRequest.front),
          back: uploadFiles(cardCreateRequest.back),
        }).pipe(
          switchMap((updatedCardCreateRequest) =>
            cardsService.createCard(deck?.id as string, updatedCardCreateRequest).pipe(
              map((card) => cardsActions.createcardSuccess({ card })),
              catchError(() => of(cardsActions.createcardFailure())),
              finalize(() => LoaderService.hideLoader()),
            ),
          ),
        );
      }),
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
  (
    actions$ = inject(Actions),
    cardsService = inject(CardsService),
    resourcesService = inject(ResourcesService),
    store = inject(Store),
  ) => {
    return actions$.pipe(
      ofType(cardsActions.editcard),
      withLatestFrom(store.select(selectActiveDeck)),
      tap(() => LoaderService.showLoader()),
      switchMap(([{ cardId, cardUpdateRequest }, deck]) => {
        // Define a function to handle file upload for an array of content elements
        const uploadFiles = (contentElements: Array<CardContentElement>): Observable<CardContentElement[]> =>
          from(contentElements).pipe(
            concatMap((contentElement) => {
              if (contentElement.type !== CardContentElementType.Text && typeof contentElement.content !== 'string') {
                // Assuming uploadFile returns an Observable<string>

                return resourcesService.uploadResource(contentElement.content as unknown as File).pipe(
                  map((res) => ({ ...contentElement, content: res.url as string })),
                  catchError(() => of(contentElement)), // Handle error if needed
                );
              } else {
                return of(contentElement);
              }
            }),
            toArray(), // Collect all results back into an array
          );

        return forkJoin({
          front: uploadFiles(cardUpdateRequest.front),
          back: uploadFiles(cardUpdateRequest.back),
        }).pipe(
          switchMap((updatedCardCreateRequest) =>
            cardsService.patchCard(deck?.id as string, cardId, updatedCardCreateRequest).pipe(
              map(() => cardsActions.editcardSuccess()),
              catchError(() => {
                return of(cardsActions.editcardFailure());
              }),
              finalize(() => LoaderService.hideLoader()),
            ),
          ),
        );
      }),
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
