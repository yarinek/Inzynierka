import { HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';

// Since Angular 14 we can use functional interceptors and it is recommended.

export const authorizationInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const token = localStorage.getItem('accessToken');
  const clonedRequest = req.clone({
    setHeaders: {
      Authorization: token ? `Token ${token}` : '',
    },
  });
  return next(clonedRequest);
};
