import { TranslateService } from '@ngx-translate/core';
import { inject } from '@angular/core';
import { selectDecodedToken } from '@app/content/auth/store/reducers';
import { ToastrService } from '@app/core/services/toast.service';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, map, of, switchMap, tap, withLatestFrom } from 'rxjs';
import { AccountsService, SettingsService, UserSettings } from 'src/http-client';
import { SiteLanguage } from '@app/shared/types/language.type';

import { settingsActions } from './actions';
import { selectUserSettings } from './reducers';

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

export const getUserSiteSettingsEffect = createEffect(
  (actions$ = inject(Actions), settingsService = inject(SettingsService)) => {
    return actions$.pipe(
      ofType(settingsActions.getusersettings),
      switchMap(() => {
        return settingsService.getUserSettings().pipe(
          map((userSettings) => settingsActions.getusersettingsSuccess({ userSettings })),
          catchError(() => of(settingsActions.getusersettingsFailure())),
        );
      }),
    );
  },
  { functional: true },
);

export const setActiveLanguageEffect = createEffect(
  (actions$ = inject(Actions), store = inject(Store), translate = inject(TranslateService)) => {
    return actions$.pipe(
      ofType(settingsActions.getusersettingsSuccess),
      withLatestFrom(store.select(selectUserSettings)),
      tap(([, userSettings]) =>
        translate.use(SiteLanguage[userSettings?.siteSettings?.displayLanguage as keyof typeof SiteLanguage] as string),
      ),
    );
  },
  { functional: true, dispatch: false },
);

export const saveUserSettingsEffect = createEffect(
  (actions$ = inject(Actions), settingsService = inject(SettingsService), store = inject(Store)) => {
    return actions$.pipe(
      ofType(settingsActions.saveusersettings),
      withLatestFrom(store.select(selectUserSettings)),
      switchMap(([, userSettings]) => {
        return settingsService.updateUserSettings(userSettings as UserSettings).pipe(
          map(() => settingsActions.saveusersettingsSuccess()),
          catchError(() => of(settingsActions.saveusersettingsFailure())),
        );
      }),
    );
  },
  { functional: true },
);
