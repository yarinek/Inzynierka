import { createActionGroup, emptyProps, props } from '@ngrx/store';
import {
  AnswerResult,
  GrammarExercise,
  GrammarExerciseSummary,
  GrammarExerciseUpsert,
  GrammarListEntry,
  ScheduledGrammarExercise,
  SubmittedExerciseReviewAnswer,
} from 'src/http-client';

export const exercisesActions = createActionGroup({
  source: 'exercises',
  events: {
    getExercises: props<{ pageIndex: number; pageSize: number }>(),
    'getExercises Success': props<{ dataSource: GrammarExerciseSummary[]; totalElements: number }>(),
    'getExercises Failure': emptyProps(),
    createExercise: props<{ grammarExerciseUpsert: GrammarExerciseUpsert }>(),
    'createExercise Success': emptyProps(),
    'createExercise Failure': emptyProps(),
    editExercise: props<{ exerciseId: string; grammarExerciseUpsert: GrammarExerciseUpsert }>(),
    'editExercise Success': emptyProps(),
    'editExercise Failure': emptyProps(),
    deleteExercise: props<{ exerciseId: string }>(),
    'deleteExercise Success': emptyProps(),
    'deleteExercise Failure': emptyProps(),
    getGrammarList: emptyProps(),
    'getGrammarList Success': props<{ grammarList: GrammarListEntry[] }>(),
    'getGrammarList Failure': emptyProps(),
    getExercise: emptyProps(),
    'getExercise Success': props<{ exercise: GrammarExercise }>(),
    'getExercise Failure': emptyProps(),
    submitAnswer: props<{ answers: SubmittedExerciseReviewAnswer }>(),
    'submitAnswer Success': props<{ exerciseAnswers: AnswerResult[] }>(),
    'submitAnswer Failure': emptyProps(),
    startNextExercise: emptyProps(),
    startActivity: emptyProps(),
    'startActivity Success': props<{ exercises: string[] }>(),
    'startActivity Failure': emptyProps(),
    startExercise: props<{ exerciseId: string }>(),
    'startExercise Success': props<{ exercise: ScheduledGrammarExercise }>(),
    'startExercise Failure': emptyProps(),
    previewExercise: props<{ exerciseId: string }>(),

    //utils
    setActiveExerciseId: props<{ exerciseId: string }>(),
  },
});
