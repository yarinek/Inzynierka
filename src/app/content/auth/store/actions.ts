import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { AccountLogin, AccountRegistration } from 'src/http-client';

export const authActions = createActionGroup({
  source: 'auth',
  events: {
    Register: props<{ request: AccountRegistration }>(),
    'Register Success': props<{ token: string }>(),
    'Register Failure': emptyProps(),

    Login: props<{ request: AccountLogin }>(),
    'Login Success': props<{ token: string }>(),
    'Login Failure': emptyProps(),

    'Get token': emptyProps(),
    'Get token success': props<{ token: string }>(),
    'Get token failure': emptyProps(),

    Logout: emptyProps(),
    'Logout Success': emptyProps(),
    'Logout Failure': emptyProps(),
  },
});
