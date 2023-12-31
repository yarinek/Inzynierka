import { createFeature, createReducer, on } from '@ngrx/store';
import { routerNavigationAction } from '@ngrx/router-store';
import {
  AnswerResult,
  GrammarExercise,
  GrammarExerciseSummary,
  GrammarListEntry,
  ScheduledGrammarExercise,
} from 'src/http-client';

import { exercisesActions } from './actions';

const initialState: {
  dataSource: GrammarExerciseSummary[];
  totalElements: number;
  grammarList: GrammarListEntry[];
  currentExercise: GrammarExercise | ScheduledGrammarExercise | null;
  currentExerciseAnswers: AnswerResult[];
  currentExerciseId: string | null;
  scheduledExercises: string[];
  scheduledExerciseId: string | null;
} = {
  totalElements: 0,
  dataSource: [],
  grammarList: [],
  currentExerciseId: null,
  currentExercise: null,
  currentExerciseAnswers: [],
  scheduledExercises: [],
  scheduledExerciseId: null,
};

const exercisesFeature = createFeature({
  name: 'exercises',
  reducer: createReducer(
    initialState,
    on(exercisesActions.getexercises, (state) => ({ ...state })),
    on(exercisesActions.getexercisesSuccess, (state, action) => ({
      ...state,
      dataSource: action.dataSource,
      totalElements: action.totalElements,
    })),
    on(exercisesActions.getexercisesFailure, (state) => ({
      ...state,
    })),
    on(exercisesActions.getgrammarlistSuccess, (state, action) => ({ ...state, grammarList: action.grammarList })),
    on(exercisesActions.getexerciseSuccess, (state, action) => ({ ...state, currentExercise: action.exercise })),
    on(exercisesActions.editexerciseSuccess, (state) => ({ ...state, currentExercise: null })),
    on(exercisesActions.previewexercise, (state, action) => ({ ...state, currentExerciseId: action.exerciseId })),
    on(exercisesActions.startactivitySuccess, (state, action) => ({ ...state, scheduledExercises: action.exercises })),
    on(exercisesActions.startexerciseSuccess, (state, action) => {
      const scheduledExercises = [...state.scheduledExercises];
      scheduledExercises.shift();
      return { ...state, currentExercise: action.exercise, scheduledExercises };
    }),
    on(exercisesActions.startexercise, (state, action) => ({ ...state, scheduledExerciseId: action.exerciseId })),
    on(exercisesActions.startexerciseFailure, (state) => ({ ...state, scheduledExerciseId: null })),
    on(exercisesActions.submitanswerSuccess, (state, action) => ({
      ...state,
      currentExerciseAnswers: action.exerciseAnswers,
    })),
    on(exercisesActions.startnextexercise, (state) => ({ ...state, currentExerciseAnswers: [] })),
    //utils
    on(exercisesActions.setactiveexerciseid, (state, action) => ({ ...state, currentExerciseId: action.exerciseId })),
    on(routerNavigationAction, (state) => ({ ...state })),
  ),
});

export const {
  name: exercisesFeatureKey,
  reducer: exerciseReducer,
  selectDataSource,
  selectTotalElements,
  selectGrammarList,
  selectCurrentExercise,
  selectCurrentExerciseId,
  selectScheduledExercises,
  selectScheduledExerciseId,
  selectCurrentExerciseAnswers,
} = exercisesFeature;
