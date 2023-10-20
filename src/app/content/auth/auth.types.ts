export interface AuthStateInterface {
  isSubmitting: boolean;
  token: string | null | undefined;
  isLoading: boolean;
  decodedToken: DecodedToken | null | undefined;
}

export interface DecodedToken {
  roles: string[];
  userId: string;
  email: string;
  sub: string;
  exp: number;
}
