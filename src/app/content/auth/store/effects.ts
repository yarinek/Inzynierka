import { inject } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { Router } from '@angular/router';
import { LoaderService } from '@app/shared/components/loader/loader.service';
import { AccountsService, AuthenticationService } from 'src/http-client';

import { CurrentUserInterface } from './../../../shared/types/currentUser.interface';
import { authActions } from './actions';

/* export const getCurrentUserEffect = createEffect(
  (actions$ = inject(Actions), authService = inject(AuthService)) => {
    return actions$.pipe(
      ofType(authActions.getCurrentUser),
      switchMap(() => {
        const token = localStorage.getItem('accessToken');

        if (!token) {
          return of(authActions.getCurrentUserFailure());
        }
        return authService.getCurrentUser().pipe(
          map((currentUser: CurrentUserInterface) => {
            return authActions.getCurrentUserSuccess({ currentUser });
          }),
          catchError(() => of(authActions.getCurrentUserFailure())),
        );
      }),
    );
  },
  { functional: true },
); */

export const registerEffect = createEffect(
  (actions$ = inject(Actions), accountService = inject(AccountsService)) => {
    return actions$.pipe(
      ofType(authActions.register),
      switchMap(({ request }) => {
        return accountService.registerNewAccount(request).pipe(
          tap(() => authActions.registerSuccess()),
          catchError(() => of(authActions.registerFailure())),
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
        authService.login({ ...request }).pipe(
          map((currentUser: CurrentUserInterface) => {
            localStorage.setItem('accessToken', currentUser.token);
            LoaderService.hideLoader();
            return authActions.loginSuccess({ currentUser });
          }),
          catchError(() => {
            LoaderService.hideLoader();
            return of(authActions.loginFailure());
          }),
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
