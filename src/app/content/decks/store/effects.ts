import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { LoaderService } from '@app/shared/components/loader/loader.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, finalize, map, of, switchMap, tap } from 'rxjs';
import { DecksPage, DecksService, SharedDecksService } from 'src/http-client';

import { decksActions } from './actions';

export const getDecksEffect = createEffect(
  (actions$ = inject(Actions), decksService = inject(DecksService)) => {
    return actions$.pipe(
      ofType(decksActions.getdecks),
      tap(() => LoaderService.showLoader()),
      switchMap(({ pageIndex, pageSize }) =>
        decksService.listDecks(pageSize, pageIndex).pipe(
          map(({ decks, total }: DecksPage) =>
            decksActions.getdecksSuccess({ dataSource: decks ?? [], totalElements: total ?? 0 }),
          ),
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
          map((deck) => decksActions.createdeckSuccess({ deck })),
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

export const editDeckEffect = createEffect(
  (actions$ = inject(Actions), decksService = inject(DecksService)) => {
    return actions$.pipe(
      ofType(decksActions.editdeck),
      tap(() => LoaderService.showLoader()),
      switchMap(({ deckId, decksCreateRequest }) =>
        decksService.updateDeck(deckId, decksCreateRequest).pipe(
          map(() => decksActions.editdeckSuccess()),
          catchError(() => {
            return of(decksActions.editdeckFailure());
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
      ofType(decksActions.editdeckSuccess),
      map(() => decksActions.getdecks({ pageIndex: 0, pageSize: 5 })),
    );
  },
  { functional: true },
);

export const deleteDeckEffect = createEffect(
  (actions$ = inject(Actions), decksService = inject(DecksService)) => {
    return actions$.pipe(
      ofType(decksActions.deletedeck),
      tap(() => LoaderService.showLoader()),
      switchMap(({ deckId }) =>
        decksService.deleteDeck(deckId).pipe(
          map(() => decksActions.deletedeckSuccess()),
          catchError(() => {
            return of(decksActions.deletedeckFailure());
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
      ofType(decksActions.deletedeckSuccess),
      map(() => decksActions.getdecks({ pageIndex: 0, pageSize: 5 })),
    );
  },
  { functional: true, dispatch: true },
);

export const navigateToCreatedDeckEffect = createEffect(
  (actions$ = inject(Actions)) => {
    return actions$.pipe(
      ofType(decksActions.createdeckSuccess),
      map(({ deck }) => decksActions.setactivedeck({ deck })),
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

// Shared decks

export const getAllSharedDecksEffect = createEffect(
  (actions$ = inject(Actions), decksService = inject(SharedDecksService)) => {
    return actions$.pipe(
      ofType(decksActions.getallshareddecks),
      tap(() => LoaderService.showLoader()),
      switchMap(() =>
        decksService.listSharedDecks().pipe(
          map(({ decks }: DecksPage) => decksActions.getallshareddecksSuccess({ sharedDecks: decks ?? [] })),
          catchError(() => {
            return of(decksActions.getallshareddecksFailure());
          }),
          finalize(() => LoaderService.hideLoader()),
        ),
      ),
    );
  },
  { functional: true },
);

export const getSharedDecksEffect = createEffect(
  (actions$ = inject(Actions), decksService = inject(SharedDecksService)) => {
    return actions$.pipe(
      ofType(decksActions.getshareddecks),
      tap(() => LoaderService.showLoader()),
      switchMap(({ pageIndex, pageSize }) =>
        decksService.listSharedDecks(pageSize, pageIndex).pipe(
          map(({ decks, total }: DecksPage) =>
            decksActions.getshareddecksSuccess({ dataSource: decks ?? [], totalElements: total ?? 0 }),
          ),
          catchError(() => {
            return of(decksActions.getshareddecksFailure());
          }),
          finalize(() => LoaderService.hideLoader()),
        ),
      ),
    );
  },
  { functional: true },
);

export const createSharedDeckEffect = createEffect(
  (actions$ = inject(Actions), decksService = inject(SharedDecksService)) => {
    return actions$.pipe(
      ofType(decksActions.createshareddeck),
      tap(() => LoaderService.showLoader()),
      switchMap(({ decksCreateRequest }) =>
        decksService.createSharedDeck(decksCreateRequest).pipe(
          map((deck) => decksActions.createshareddeckSuccess({ deck })),
          catchError(() => {
            return of(decksActions.createshareddeckFailure());
          }),
          finalize(() => LoaderService.hideLoader()),
        ),
      ),
    );
  },
  { functional: true },
);

export const editSharedDeckEffect = createEffect(
  (actions$ = inject(Actions), decksService = inject(SharedDecksService)) => {
    return actions$.pipe(
      ofType(decksActions.editshareddeck),
      tap(() => LoaderService.showLoader()),
      switchMap(({ deckId, decksCreateRequest }) =>
        decksService.updateSharedDeck(deckId, decksCreateRequest).pipe(
          map(() => decksActions.editshareddeckSuccess()),
          catchError(() => {
            return of(decksActions.editshareddeckFailure());
          }),
          finalize(() => LoaderService.hideLoader()),
        ),
      ),
    );
  },
  { functional: true },
);

export const refreshViewAfterEditSharedDeck = createEffect(
  (actions$ = inject(Actions)) => {
    return actions$.pipe(
      ofType(decksActions.editshareddeckSuccess),
      map(() => decksActions.getshareddecks({ pageIndex: 0, pageSize: 5 })),
    );
  },
  { functional: true },
);

export const deleteSharedDeckEffect = createEffect(
  (actions$ = inject(Actions), decksService = inject(SharedDecksService)) => {
    return actions$.pipe(
      ofType(decksActions.deleteshareddeck),
      tap(() => LoaderService.showLoader()),
      switchMap(({ deckId }) =>
        decksService.deleteSharedDeck(deckId).pipe(
          map(() => decksActions.deleteshareddeckSuccess()),
          catchError(() => {
            return of(decksActions.deleteshareddeckFailure());
          }),
          finalize(() => LoaderService.hideLoader()),
        ),
      ),
    );
  },
  { functional: true },
);

export const refreshViewAfterDeleteSharedDeck = createEffect(
  (actions$ = inject(Actions)) => {
    return actions$.pipe(
      ofType(decksActions.deletedeckSuccess),
      map(() => decksActions.getshareddecks({ pageIndex: 0, pageSize: 5 })),
    );
  },
  { functional: true, dispatch: true },
);

export const navigateToCreatedSharedDeckEffect = createEffect(
  (actions$ = inject(Actions)) => {
    return actions$.pipe(
      ofType(decksActions.createshareddeckSuccess),
      map(({ deck }) => decksActions.setactiveshareddeck({ deck })),
    );
  },
  { functional: true },
);

export const navigateToSharedCardsEffect = createEffect(
  (actions$ = inject(Actions), router = inject(Router)) => {
    return actions$.pipe(
      ofType(decksActions.setactiveshareddeck),
      tap(() => {
        void router.navigateByUrl('/cards/shared');
      }),
    );
  },
  { functional: true, dispatch: false },
);
