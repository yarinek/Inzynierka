import { createFeature, createReducer, on } from '@ngrx/store';
import { routerNavigationAction } from '@ngrx/router-store';
import { GrammarExercise, GrammarExerciseSummary, GrammarListEntry, ScheduledGrammarExercise } from 'src/http-client';

import { exercisesActions } from './actions';

const initialState: {
  dataSource: GrammarExerciseSummary[];
  totalElements: number;
  grammarList: GrammarListEntry[];
  currentExercise: GrammarExercise | ScheduledGrammarExercise | null;
  currentExerciseId: string | null;
  scheduledExercises: string[];
} = {
  totalElements: 0,
  dataSource: [],
  grammarList: [],
  currentExerciseId: null,
  currentExercise: null,
  scheduledExercises: [],
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
} = exercisesFeature;
