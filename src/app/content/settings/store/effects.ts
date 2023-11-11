import { inject } from '@angular/core';
import { selectDecodedToken } from '@app/content/auth/store/reducers';
import { ToastrService } from '@app/core/services/toast.service';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, map, of, switchMap, tap, withLatestFrom } from 'rxjs';
import { AccountsService } from 'src/http-client';

import { settingsActions } from './actions';

export const updateAccountEffect = createEffect(
  (actions$ = inject(Actions), accountService = inject(AccountsService)) => {
    return actions$.pipe(
      ofType(settingsActions.changeemail),
      switchMap(({ accountId, accountUpdate }) => {
        return accountService.updateAccount(accountId, accountUpdate).pipe(
          tap(() => settingsActions.changeemailSuccess()),
          catchError(() => of(settingsActions.changeemailFailure())),
        );
      }),
    );
  },
  { functional: true },
);

export const resetPasswordEffect = createEffect(
  (
    actions$ = inject(Actions),
    accountService = inject(AccountsService),
    store = inject(Store),
    toast = inject(ToastrService),
  ) => {
    return actions$.pipe(
      ofType(settingsActions.resetpassword),
      withLatestFrom(store.select(selectDecodedToken)),
      switchMap(([, decodedToken]) =>
        accountService.createPasswordResetToken({ email: decodedToken?.email as string }).pipe(
          map(() => {
            toast.success('Password reset email sent');
            return settingsActions.resetpasswordSuccess();
          }),
          catchError(() => of(settingsActions.resetpasswordFailure())),
        ),
      ),
    );
  },
  { functional: true },
);

export const verifyPasswordEffect = createEffect(
  (
    actions$ = inject(Actions),
    accountService = inject(AccountsService),
    store = inject(Store),
    toast = inject(ToastrService),
  ) => {
    return actions$.pipe(
      ofType(settingsActions.verifypassword),
      withLatestFrom(store.select(selectDecodedToken)),
      switchMap(([request, decodedToken]) => {
        return accountService.verifyPasswordResetToken({ ...request, email: decodedToken?.email as string }).pipe(
          map(() => {
            toast.success('Password has been changed successfully');
            return settingsActions.verifypasswordSuccess();
          }),
          catchError(() => of(settingsActions.verifypasswordFailure())),
        );
      }),
    );
  },
  { functional: true },
);
