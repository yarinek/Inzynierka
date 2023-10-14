import { createFeature, createReducer, on } from '@ngrx/store';
import { routerNavigationAction } from '@ngrx/router-store';

import { AuthStateInterface } from '../auth.types';
import { authActions } from './actions';

const initialState: AuthStateInterface = {
  isSubmitting: false,
  isLoading: false,
  currentUser: undefined,
};

const authFeature = createFeature({
  name: 'auth',
  reducer: createReducer(
    initialState,
    on(authActions.register, (state) => ({ ...state, isSubmitting: true })),
    on(authActions.registerSuccess, (state) => ({
      ...state,
      isSubmitting: false,
    })),
    on(authActions.registerFailure, (state) => ({
      ...state,
      isSubmitting: false,
    })),
    on(authActions.login, (state) => ({ ...state, isSubmitting: true })),
    on(authActions.loginSuccess, (state, action) => ({
      ...state,
      isSubmitting: false,
      currentUser: action.currentUser,
    })),
    on(authActions.loginFailure, (state) => ({
      ...state,
      isSubmitting: false,
    })),
    on(authActions.getCurrentUser, (state) => ({ ...state, isLoading: true })),
    on(authActions.getCurrentUserSuccess, (state, action) => ({
      ...state,
      isLoading: false,
      currentUser: action.currentUser,
    })),
    on(authActions.getCurrentUserFailure, (state) => ({
      ...state,
      isLoading: false,
      currentUser: null,
    })),
    on(routerNavigationAction, (state) => ({ ...state })),
  ),
});

export const {
  name: authFeatureKey,
  reducer: authReducer,
  selectIsSubmitting,
  selectIsLoading,
  selectCurrentUser,
} = authFeature;
