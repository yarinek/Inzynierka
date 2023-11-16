import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { GrammarExerciseSummary, GrammarExerciseUpsert, GrammarListEntry } from 'src/http-client';

export const exercisesActions = createActionGroup({
  source: 'exercises',
  events: {
    getExercises: props<{ pageIndex: number; pageSize: number }>(),
    'getExercises Success': props<{ dataSource: GrammarExerciseSummary[]; totalElements: number }>(),
    'getExercises Failure': emptyProps(),
    createExercise: props<{ grammarExerciseUpsert: GrammarExerciseUpsert }>(),
    'createExercise Success': emptyProps(),
    'createExercise Failure': emptyProps(),
    deleteExercise: props<{ exerciseId: string }>(),
    'deleteExercise Success': emptyProps(),
    'deleteExercise Failure': emptyProps(),
    getGrammarList: emptyProps(),
    'getGrammarList Success': props<{ grammarList: GrammarListEntry[] }>(),
    'getGrammarList Failure': emptyProps(),
  },
});
