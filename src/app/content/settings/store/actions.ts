import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { AccountUpdate, PasswordResetRequest, PasswordResetTokenRequest } from 'src/http-client';

export const settingsActions = createActionGroup({
  source: 'settings',
  events: {
    ChangeEmail: props<{ accountId: string; accountUpdate: AccountUpdate }>(),
    'ChangeEmail Success': emptyProps(),
    'ChangeEmail Failure': emptyProps(),

    ResetPassword: props<{ data: PasswordResetTokenRequest }>(),
    'ResetPassword Success': emptyProps(),
    'ResetPassword Failure': emptyProps(),

    VerifyPassword: props<{ request: PasswordResetRequest }>(),
    'VerifyPassword Success': emptyProps(),
    'VerifyPassword Failure': emptyProps(),
  },
});
