import { createFeature, createReducer, on } from '@ngrx/store';
import { routerNavigationAction } from '@ngrx/router-store';

import { settingsActions } from './actions';

const initialState = {
  isSubmitting: false,
  isLoading: false,
};

const settingsFeature = createFeature({
  name: 'settings',
  reducer: createReducer(
    initialState,
    on(settingsActions.changeemail, (state) => ({ ...state, isSubmitting: true })),
    on(settingsActions.changeemailSuccess, (state) => ({
      ...state,
      isSubmitting: false,
    })),
    on(settingsActions.changeemailFailure, (state) => ({
      ...state,
      isSubmitting: false,
    })),
    on(routerNavigationAction, (state) => ({ ...state })),
  ),
});

export const {
  name: settingsFeatureKey,
  reducer: settingsReducer,
  selectIsSubmitting,
  selectIsLoading,
} = settingsFeature;
