import { inject } from '@angular/core';
import { ToastrService } from '@app/core/services/toast.service';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap, tap } from 'rxjs';
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
  (actions$ = inject(Actions), accountService = inject(AccountsService), toast = inject(ToastrService)) => {
    return actions$.pipe(
      ofType(settingsActions.resetpassword),
      switchMap(({ data }) =>
        accountService.createPasswordResetToken(data).pipe(
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
  (actions$ = inject(Actions), accountService = inject(AccountsService), toast = inject(ToastrService)) => {
    return actions$.pipe(
      ofType(settingsActions.verifypassword),
      switchMap(({ request }) => {
        return accountService.verifyPasswordResetToken(request).pipe(
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
