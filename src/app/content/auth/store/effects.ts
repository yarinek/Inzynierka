import { inject } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { Router } from '@angular/router';
import { LoaderService } from '@app/shared/components/loader/loader.service';
import {
  AccountRegistrationResult,
  AccountsService,
  AuthenticationResult,
  AuthenticationService,
} from 'src/http-client';
import { finalize } from 'rxjs/internal/operators/finalize';
import { settingsActions } from '@app/content/settings/store/actions';

import { authActions } from './actions';

export const getTokenEffect = createEffect(
  (actions$ = inject(Actions)) => {
    return actions$.pipe(
      ofType(authActions.getToken),
      map(() => {
        const token = localStorage.getItem('accessToken');
        if (token) {
          return authActions.getTokenSuccess({ token });
        }
        return authActions.getTokenFailure();
      }),
    );
  },
  { functional: true },
);

export const getUserSettingsEffect = createEffect(
  (actions$ = inject(Actions)) => {
    return actions$.pipe(
      ofType(authActions.getTokenSuccess),
      map(() => settingsActions.getusersettings()),
    );
  },
  { functional: true },
);

export const registerEffect = createEffect(
  (actions$ = inject(Actions), accountService = inject(AccountsService)) => {
    return actions$.pipe(
      ofType(authActions.register),
      tap(() => LoaderService.showLoader()),
      switchMap(({ request }) => {
        return accountService.registerNewAccount(request).pipe(
          map(({ token }: AccountRegistrationResult) => {
            const jwtToken = (token as string).replace('Bearer ', '');
            setToken(jwtToken);
            return authActions.registerSuccess({ token: jwtToken });
          }),
          catchError(() => {
            return of(authActions.registerFailure());
          }),
          finalize(() => LoaderService.hideLoader()),
        );
      }),
    );
  },
  { functional: true },
);

export const redirectAfterRegisterEffect = createEffect(
  (actions$ = inject(Actions), router = inject(Router)) => {
    return actions$.pipe(
      ofType(authActions.registerSuccess),
      tap((): void => {
        void router.navigateByUrl('/');
      }),
    );
  },
  {
    functional: true,
    dispatch: false,
  },
);

export const loginEffect = createEffect(
  (actions$ = inject(Actions), authService = inject(AuthenticationService)) => {
    return actions$.pipe(
      ofType(authActions.login),
      tap(() => LoaderService.showLoader()),
      switchMap(({ request }) =>
        authService.login(request).pipe(
          map(({ token }: AuthenticationResult) => {
            const jwtToken = (token as string).replace('Bearer ', '');
            setToken(jwtToken);
            return authActions.loginSuccess({ token: jwtToken });
          }),
          catchError(() => {
            return of(authActions.loginFailure());
          }),
          finalize(() => LoaderService.hideLoader()),
        ),
      ),
    );
  },
  { functional: true },
);

export const redirectAfterLoginEffect = createEffect(
  (actions$ = inject(Actions), router = inject(Router)) => {
    return actions$.pipe(
      ofType(authActions.loginSuccess),
      tap((): void => {
        void router.navigateByUrl('/');
      }),
    );
  },
  {
    functional: true,
    dispatch: false,
  },
);
export const redirectAfterLogoutEffect = createEffect(
  (actions$ = inject(Actions), router = inject(Router)) => {
    return actions$.pipe(
      ofType(authActions.logoutSuccess),
      tap((): void => {
        void router.navigateByUrl('/login');
      }),
    );
  },
  {
    functional: true,
    dispatch: false,
  },
);

export const logoutEffect = createEffect(
  (actions$ = inject(Actions)) => {
    return actions$.pipe(
      ofType(authActions.logout),
      tap(() => LoaderService.showLoader()),
      map(() => {
        localStorage.removeItem('accessToken');
        return authActions.logoutSuccess();
      }),
      tap(() => LoaderService.hideLoader()),
    );
  },
  { functional: true },
);

function setToken(token: string): void {
  localStorage.setItem('accessToken', token);
}
