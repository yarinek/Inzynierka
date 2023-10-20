import { catchError, throwError } from 'rxjs';
import { HttpErrorResponse, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';

import { ToastrService } from '../services/toast.service';

// Since Angular 14 we can use functional interceptors and it is recommended.

export const authorizationInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const toast = inject(ToastrService);
  const token = localStorage.getItem('accessToken');
  let clonedRequest = req.clone();
  if (token) {
    clonedRequest = req.clone({
      setHeaders: {
        Authorization: token ? `Token ${token}` : '',
      },
    });
  }

  return next(clonedRequest).pipe(
    catchError((err: HttpErrorResponse) => {
      toast.error('Something went wrong');
      return throwError(() => err);
    }),
  );
};
