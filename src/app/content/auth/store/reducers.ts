import { createFeature, createReducer, on } from '@ngrx/store';
import { routerNavigationAction } from '@ngrx/router-store';
import jwtDecode from 'jwt-decode';

import { AuthStateInterface, DecodedToken } from '../auth.types';
import { authActions } from './actions';

const initialState: AuthStateInterface = {
  isSubmitting: false,
  isLoading: false,
  token: undefined,
  decodedToken: undefined,
};

const authFeature = createFeature({
  name: 'auth',
  reducer: createReducer(
    initialState,
    on(authActions.register, (state) => ({ ...state, isSubmitting: true })),
    on(authActions.registerSuccess, (state, action) => ({
      ...state,
      isSubmitting: false,
      token: action.token,
      decodedToken: getDecodedToken(action.token),
    })),
    on(authActions.registerFailure, (state) => ({
      ...state,
      isSubmitting: false,
    })),
    on(authActions.login, (state) => ({ ...state, isSubmitting: true })),
    on(authActions.loginSuccess, (state, action) => ({
      ...state,
      isSubmitting: false,
      token: action.token,
      decodedToken: getDecodedToken(action.token),
    })),
    on(authActions.loginFailure, (state) => ({
      ...state,
      isSubmitting: false,
    })),
    on(authActions.getToken, (state) => ({ ...state, isLoading: true })),
    on(authActions.getTokenSuccess, (state, action) => ({
      ...state,
      isLoading: false,
      token: action.token,
      decodedToken: getDecodedToken(action.token),
    })),
    on(authActions.getTokenFailure, (state) => ({
      ...state,
      isLoading: false,
      token: null,
      decodedToken: null,
    })),
    on(authActions.logout, (state) => ({ ...state })),
    on(authActions.logoutSuccess, (state) => ({
      ...state,
      token: null,
      decodedToken: null,
    })),
    on(authActions.logoutFailure, (state) => ({ ...state })),
    on(routerNavigationAction, (state) => ({ ...state })),
  ),
});

function getDecodedToken(token: string): DecodedToken {
  return jwtDecode(token);
}

export const {
  name: authFeatureKey,
  reducer: authReducer,
  selectIsSubmitting,
  selectIsLoading,
  selectToken,
  selectDecodedToken,
} = authFeature;
