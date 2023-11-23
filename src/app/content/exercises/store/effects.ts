import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from '@app/core/services/toast.service';
import { LoaderService } from '@app/shared/components/loader/loader.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, finalize, forkJoin, map, Observable, of, switchMap, tap, withLatestFrom } from 'rxjs';
import {
  ExercisesService,
  GrammarExercisesPage,
  GrammarService,
  ResourcesService,
  ScheduleService,
} from 'src/http-client';

import { exercisesActions } from './actions';
import { selectCurrentExerciseId, selectScheduledExercises } from './reducers';

export const getExercisesEffect = createEffect(
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

export const createExerciseEffect = createEffect(
  (
    actions$ = inject(Actions),
    exercisesService = inject(ExercisesService),
    resourcesService = inject(ResourcesService),
  ) => {
    return actions$.pipe(
      ofType(exercisesActions.createexercise),
      tap(() => LoaderService.showLoader()),
      switchMap(({ grammarExerciseUpsert }) => {
        const uploadFiles = (file: File): Observable<string | File | undefined> => {
          return resourcesService.uploadResource(file).pipe(
            map((res) => res.url),
            catchError(() => of(file)), // Handle error if needed
          );
        };

        return forkJoin({
          audioUrl: grammarExerciseUpsert.audioUrl
            ? uploadFiles(grammarExerciseUpsert.audioUrl as unknown as File)
            : of(undefined),
          imgUrl: grammarExerciseUpsert.imgUrl
            ? uploadFiles(grammarExerciseUpsert.imgUrl as unknown as File)
            : of(undefined),
        }).pipe(
          switchMap(({ audioUrl, imgUrl }) => {
            return exercisesService
              .createNewExercise({
                ...grammarExerciseUpsert,
                audioUrl: audioUrl as string,
                imgUrl: imgUrl as string,
              })
              .pipe(
                map(() => exercisesActions.createexerciseSuccess()),
                catchError(() => {
                  return of(exercisesActions.createexerciseFailure());
                }),
                finalize(() => LoaderService.hideLoader()),
              );
          }),
        );
      }),
    );
  },
  { functional: true },
);

export const refreshViewAfterCreateExercise = createEffect(
  (actions$ = inject(Actions)) => {
    return actions$.pipe(
      ofType(exercisesActions.createexerciseSuccess),
      map(() => exercisesActions.getexercises({ pageIndex: 0, pageSize: 5 })),
    );
  },
  { functional: true, dispatch: true },
);

export const updateExerciseEffect = createEffect(
  (
    actions$ = inject(Actions),
    exercisesService = inject(ExercisesService),
    resourcesService = inject(ResourcesService),
  ) => {
    return actions$.pipe(
      ofType(exercisesActions.editexercise),
      tap(() => LoaderService.showLoader()),
      switchMap(({ exerciseId, grammarExerciseUpsert }) => {
        const uploadFiles = (file: File | string): Observable<string | File | undefined> => {
          if (typeof file === 'string') {
            return of(file);
          }
          return resourcesService.uploadResource(file).pipe(
            map((res) => res.url),
            catchError(() => of(file)), // Handle error if needed
          );
        };

        return forkJoin({
          audioUrl: grammarExerciseUpsert.audioUrl ? uploadFiles(grammarExerciseUpsert.audioUrl) : of(undefined),
          imgUrl: grammarExerciseUpsert.imgUrl ? uploadFiles(grammarExerciseUpsert.imgUrl) : of(undefined),
        }).pipe(
          switchMap(({ audioUrl, imgUrl }) =>
            exercisesService
              .updateExercise(exerciseId, {
                ...grammarExerciseUpsert,
                audioUrl: audioUrl as string,
                imgUrl: imgUrl as string,
              })
              .pipe(
                map(() => exercisesActions.editexerciseSuccess()),
                catchError(() => {
                  return of(exercisesActions.editexerciseFailure());
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

export const startNextExerciseAfterSubmitAnswerEffect = createEffect(
  (actions$ = inject(Actions), store = inject(Store)) => {
    return actions$.pipe(
      ofType(exercisesActions.submitanswerSuccess),
      withLatestFrom(store.select(selectScheduledExercises)),
      tap(() => LoaderService.showLoader()),
      map(([, exercises]) => {
        if (exercises.length === 0) {
          return exercisesActions.startexerciseFailure();
        }
        return exercisesActions.startexercise({ exerciseId: exercises.shift() as string });
      }),
    );
  },
  { functional: true },
);

export const startActivityEffect = createEffect(
  (actions$ = inject(Actions), scheduleService = inject(ScheduleService)) => {
    return actions$.pipe(
      ofType(exercisesActions.startactivity),
      tap(() => LoaderService.showLoader()),
      switchMap(() =>
        scheduleService.getScheduledExercises().pipe(
          map((exercises) => exercisesActions.startactivitySuccess({ exercises: exercises.exercises ?? [] })),
          catchError(() => {
            return of(exercisesActions.startactivityFailure());
          }),
          finalize(() => LoaderService.hideLoader()),
        ),
      ),
    );
  },
  { functional: true },
);

export const startExerciseAfterStartActivityEffect = createEffect(
  (actions$ = inject(Actions), store = inject(Store), toast = inject(ToastrService)) => {
    return actions$.pipe(
      ofType(exercisesActions.startactivitySuccess),
      withLatestFrom(store.select(selectScheduledExercises)),
      tap(() => LoaderService.showLoader()),
      map(([, exercises]) => {
        if (exercises.length === 0) {
          toast.info('errors.noScheduledExercises');
          return exercisesActions.startexerciseFailure();
        }
        return exercisesActions.startexercise({ exerciseId: exercises.shift() as string });
      }),
    );
  },
  { functional: true },
);

export const redirectIfNoExercisesEffect = createEffect(
  (actions$ = inject(Actions), router = inject(Router)) => {
    return actions$.pipe(
      ofType(exercisesActions.startactivityFailure),
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

export const startExerciseEffect = createEffect(
  (actions$ = inject(Actions), scheduleService = inject(ScheduleService)) => {
    return actions$.pipe(
      ofType(exercisesActions.startexercise),
      tap(() => LoaderService.showLoader()),
      switchMap(({ exerciseId }) => {
        return scheduleService.getScheduledExercise(exerciseId).pipe(
          map((exercise) => exercisesActions.startexerciseSuccess({ exercise })),
          catchError(() => {
            return of(exercisesActions.startexerciseFailure());
          }),
          finalize(() => LoaderService.hideLoader()),
        );
      }),
    );
  },
  { functional: true },
);

export const redirectAfterStartExerciseEffect = createEffect(
  (actions$ = inject(Actions), router = inject(Router)) => {
    return actions$.pipe(
      ofType(exercisesActions.startexerciseSuccess),
      tap((): void => {
        void router.navigateByUrl('/exercises/exercise');
      }),
    );
  },
  {
    functional: true,
    dispatch: false,
  },
);
