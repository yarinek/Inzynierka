import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { LoaderService } from '@app/shared/components/loader/loader.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, finalize, map, of, switchMap, tap, withLatestFrom } from 'rxjs';
import { ExercisesService, GrammarExercisesPage, GrammarService } from 'src/http-client';

import { exercisesActions } from './actions';
import { selectCurrentExerciseId } from './reducers';

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

export const updateDeckEffect = createEffect(
  (actions$ = inject(Actions), exercisesService = inject(ExercisesService)) => {
    return actions$.pipe(
      ofType(exercisesActions.editexercise),
      tap(() => LoaderService.showLoader()),
      switchMap(({ exerciseId, grammarExerciseUpsert }) =>
        exercisesService.updateExercise(exerciseId, grammarExerciseUpsert).pipe(
          map(() => exercisesActions.editexerciseSuccess()),
          catchError(() => {
            return of(exercisesActions.editexerciseFailure());
          }),
          finalize(() => LoaderService.hideLoader()),
        ),
      ),
    );
  },
  { functional: true },
);

export const refreshViewAfterEditExercise = createEffect(
  (actions$ = inject(Actions)) => {
    return actions$.pipe(
      ofType(exercisesActions.editexerciseSuccess),
      map(() => exercisesActions.getexercises({ pageIndex: 0, pageSize: 5 })),
    );
  },
  { functional: true, dispatch: true },
);

export const deleteExerciseEffect = createEffect(
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

export const refreshViewAfterDeleteExercise = createEffect(
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

export const getExerciseEffect = createEffect(
  (actions$ = inject(Actions), exercisesService = inject(ExercisesService), store = inject(Store)) => {
    return actions$.pipe(
      ofType(exercisesActions.getexercise),
      withLatestFrom(store.select(selectCurrentExerciseId)),
      tap(() => LoaderService.showLoader()),
      switchMap(([, id]) => {
        if (id === null) {
          return of(exercisesActions.getexerciseFailure());
        }
        return exercisesService.getExercise(id).pipe(
          map((exercise) => exercisesActions.getexerciseSuccess({ exercise })),
          catchError(() => {
            return of(exercisesActions.getexerciseFailure());
          }),
          finalize(() => LoaderService.hideLoader()),
        );
      }),
    );
  },
  { functional: true },
);

export const navigateToCardsEffect = createEffect(
  (actions$ = inject(Actions), router = inject(Router)) => {
    return actions$.pipe(
      ofType(exercisesActions.previewexercise),
      tap(() => {
        void router.navigateByUrl('/exercises/preview');
      }),
    );
  },
  { functional: true, dispatch: false },
);

export const redirectIfNoActiveExerciseEffect = createEffect(
  (actions$ = inject(Actions), router = inject(Router)) => {
    return actions$.pipe(
      ofType(exercisesActions.getexerciseFailure),
      tap((): void => {
        void router.navigateByUrl('/exercises');
      }),
    );
  },
  {
    functional: true,
    dispatch: false,
  },
);

export const submitAnswerEffect = createEffect(
  (actions$ = inject(Actions), exercisesService = inject(ExercisesService), store = inject(Store)) => {
    return actions$.pipe(
      ofType(exercisesActions.submitanswer),
      withLatestFrom(store.select(selectCurrentExerciseId)),
      tap(() => LoaderService.showLoader()),
      switchMap(([{ answers }, exerciseId]) =>
        exercisesService.submitAnswerForExercise(exerciseId as string, answers).pipe(
          map(() => exercisesActions.submitanswerSuccess()),
          catchError(() => {
            return of(exercisesActions.submitanswerFailure());
          }),
          finalize(() => LoaderService.hideLoader()),
        ),
      ),
    );
  },
  { functional: true },
);
