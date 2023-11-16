import { inject } from '@angular/core';
import { LoaderService } from '@app/shared/components/loader/loader.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, finalize, map, of, switchMap, tap } from 'rxjs';
import { ExercisesService, GrammarExercisesPage, GrammarService } from 'src/http-client';

import { exercisesActions } from './actions';

export const getDecksEffect = createEffect(
  (actions$ = inject(Actions), exercisesService = inject(ExercisesService)) => {
    return actions$.pipe(
      ofType(exercisesActions.getexercises),
      tap(() => LoaderService.showLoader()),
      switchMap(({ pageIndex, pageSize }) =>
        exercisesService.listExercises(pageSize, pageIndex).pipe(
          map(({ exercises, total }: GrammarExercisesPage) =>
            exercisesActions.getexercisesSuccess({ dataSource: exercises ?? [], totalElements: total ?? 0 }),
          ),
          catchError(() => {
            return of(exercisesActions.getexercisesFailure());
          }),
          finalize(() => LoaderService.hideLoader()),
        ),
      ),
    );
  },
  { functional: true },
);

export const getGramarAfterLoadEffect = createEffect(
  (actions$ = inject(Actions)) => {
    return actions$.pipe(
      ofType(exercisesActions.getexercises),
      map(() => exercisesActions.getgrammarlist()),
    );
  },
  { functional: true },
);

export const createDeckEffect = createEffect(
  (actions$ = inject(Actions), exercisesService = inject(ExercisesService)) => {
    return actions$.pipe(
      ofType(exercisesActions.createexercise),
      tap(() => LoaderService.showLoader()),
      switchMap(({ grammarExerciseUpsert }) =>
        exercisesService.createNewExercise(grammarExerciseUpsert).pipe(
          map(() => exercisesActions.createexerciseSuccess()),
          catchError(() => {
            return of(exercisesActions.createexerciseFailure());
          }),
          finalize(() => LoaderService.hideLoader()),
        ),
      ),
    );
  },
  { functional: true },
);

export const deleteDeckEffect = createEffect(
  (actions$ = inject(Actions), exercisesService = inject(ExercisesService)) => {
    return actions$.pipe(
      ofType(exercisesActions.deleteexercise),
      tap(() => LoaderService.showLoader()),
      switchMap(({ exerciseId }) =>
        exercisesService.deleteExercise(exerciseId).pipe(
          map(() => exercisesActions.deleteexerciseSuccess()),
          catchError(() => {
            return of(exercisesActions.deleteexerciseFailure());
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
      ofType(exercisesActions.deleteexerciseSuccess),
      map(() => exercisesActions.getexercises({ pageIndex: 0, pageSize: 5 })),
    );
  },
  { functional: true, dispatch: true },
);

export const getGrammarListEffect = createEffect(
  (actions$ = inject(Actions), grammarService = inject(GrammarService)) => {
    return actions$.pipe(
      ofType(exercisesActions.getgrammarlist),
      tap(() => LoaderService.showLoader()),
      switchMap(() =>
        grammarService.listGrammar('ENGLISH').pipe(
          map(({ grammarList }) => exercisesActions.getgrammarlistSuccess({ grammarList: grammarList ?? [] })),
          catchError(() => {
            return of(exercisesActions.getgrammarlistFailure());
          }),
          finalize(() => LoaderService.hideLoader()),
        ),
      ),
    );
  },
  { functional: true },
);
