import { createFeature, createReducer, on } from '@ngrx/store';
import { routerNavigatedAction } from '@ngrx/router-store';

import { ExampleStateInterface } from '../example.types';
import { exampleActions } from './actions';

const initialState: ExampleStateInterface = {
  example: '',
};

const exampleFeature = createFeature({
  name: 'example',
  reducer: createReducer(
    initialState,
    on(exampleActions.getExample, (state) => ({ ...state, isLoading: true })),
    on(exampleActions.getExampleSuccess, (state, action) => ({ ...state, isLoading: false, data: action.example })),
    on(exampleActions.getExampleFailure, (state) => ({ ...state, isLoading: false })),
    on(routerNavigatedAction, () => initialState),
  ),
});

export const { name: exampleFeatureKey, reducer: exampleReducer, selectExample } = exampleFeature;
