import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { LoginRequest, RegisterRequest } from '@content/auth/auth.types';
import { CurrentUserInterface } from '@app/shared/types/currentUser.interface';

export const authActions = createActionGroup({
  source: 'auth',
  events: {
    Register: props<{ request: RegisterRequest }>(),
    'Register Success': props<{ currentUser: CurrentUserInterface }>(),
    'Register Failure': emptyProps(),

    Login: props<{ request: LoginRequest }>(),
    'Login Success': props<{ currentUser: CurrentUserInterface }>(),
    'Login Failure': emptyProps(),

    'Get current user': emptyProps(),
    'Get current user success': props<{ currentUser: CurrentUserInterface }>(),
    'Get current user failure': emptyProps(),
  },
});
