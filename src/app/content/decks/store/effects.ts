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
