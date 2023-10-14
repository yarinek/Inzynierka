import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { CurrentUserInterface } from '@app/shared/types/currentUser.interface';
import { AccountLogin, AccountRegistration } from 'src/http-client';

export const authActions = createActionGroup({
  source: 'auth',
  events: {
    Register: props<{ request: AccountRegistration }>(),
    'Register Success': emptyProps(),
    'Register Failure': emptyProps(),

    Login: props<{ request: AccountLogin }>(),
    'Login Success': props<{ currentUser: CurrentUserInterface }>(),
    'Login Failure': emptyProps(),

    'Get current user': emptyProps(),
    'Get current user success': props<{ currentUser: CurrentUserInterface }>(),
    'Get current user failure': emptyProps(),
  },
});
