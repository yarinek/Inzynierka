import { CurrentUserInterface } from '@app/shared/types/currentUser.interface';

export interface RegisterRequest {
  user: {
    email: string;
    password: string;
    username: string;
  };
}

export interface LoginRequest {
  user: {
    email: string;
    password: string;
  };
}

export interface AuthStateInterface {
  isSubmitting: boolean;
  currentUser: CurrentUserInterface | null | undefined;
  isLoading: boolean;
}

export interface AuthResponseInterface {
  user: CurrentUserInterface;
}
