import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { AccountUpdate } from 'src/http-client';

export const settingsActions = createActionGroup({
  source: 'settings',
  events: {
    ChangeEmail: props<{ accountId: string; accountUpdate: AccountUpdate }>(),
    'ChangeEmail Success': emptyProps(),
    'ChangeEmail Failure': emptyProps(),

    ResetPassword: emptyProps(),
    'ResetPassword Success': emptyProps(),
    'ResetPassword Failure': emptyProps(),

    VerifyPassword: props<{ token: string; newPassword: string }>(),
    'VerifyPassword Success': emptyProps(),
    'VerifyPassword Failure': emptyProps(),
  },
});
