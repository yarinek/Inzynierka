import { createFeature, createReducer, on } from '@ngrx/store';
import { routerNavigationAction } from '@ngrx/router-store';
import { GrammarExerciseSummary, GrammarListEntry } from 'src/http-client';

import { exercisesActions } from './actions';

const initialState: {
  dataSource: GrammarExerciseSummary[];
  totalElements: number;
  grammarList: GrammarListEntry[];
} = {
  totalElements: 0,
  dataSource: [],
  grammarList: [],
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
    on(routerNavigationAction, (state) => ({ ...state })),
  ),
});

export const {
  name: exercisesFeatureKey,
  reducer: exerciseReducer,
  selectDataSource,
  selectTotalElements,
  selectGrammarList,
} = exercisesFeature;
