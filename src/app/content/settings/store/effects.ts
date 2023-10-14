import { inject } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { catchError, of, switchMap, tap } from 'rxjs';
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
