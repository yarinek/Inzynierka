import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { AccountUpdate } from 'src/http-client';

export const settingsActions = createActionGroup({
  source: 'settings',
  events: {
    ChangeEmail: props<{ accountId: string; accountUpdate: AccountUpdate }>(),
    'ChangeEmail Success': emptyProps(),
    'ChangeEmail Failure': emptyProps(),

    /* ChangePassword: props<{ request: AccountLogin }>(),
    'ChangePassword Success': props<{ currentUser: CurrentUserInterface }>(),
    'ChangePassword Failure': emptyProps(),

    'Get current user': emptyProps(),
    'Get current user success': props<{ currentUser: CurrentUserInterface }>(),
    'Get current user failure': emptyProps(), */
  },
});
