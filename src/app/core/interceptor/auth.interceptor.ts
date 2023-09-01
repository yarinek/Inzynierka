import { inject } from '@angular/core';
import { HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';

import { PersistanceService } from '../persistance.service';

export const authorizationInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const persistanceService = inject(PersistanceService);
  const token = persistanceService.get('accessToken') as string | null;
  const clonedRequest = req.clone({
    setHeaders: {
      Authorization: token ? `Token ${token}` : '',
    },
    url: environment.apiUrl + req.url,
  });
  return next(clonedRequest);
};
