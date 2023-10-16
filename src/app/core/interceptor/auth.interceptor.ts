import { HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';

// Since Angular 14 we can use functional interceptors and it is recommended.

export const authorizationInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const token = localStorage.getItem('accessToken');
  let clonedRequest = req.clone({
    setHeaders: {
      'Access-Control-Allow-Origin': '*',
    },
  });
  if (token) {
    clonedRequest = req.clone({
      setHeaders: {
        Authorization: token ? `Token ${token}` : '',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }

  return next(clonedRequest);
};
