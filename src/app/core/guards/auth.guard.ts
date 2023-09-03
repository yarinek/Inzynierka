import { inject } from '@angular/core';
import { Router } from '@angular/router';

import { PersistanceService } from '../persistance.service';

export const canActivateLoggedRoutesFn = (): boolean => {
  const persistanceService = inject(PersistanceService);
  const router = inject(Router);
  const token = persistanceService.get('accessToken');
  if (token) {
    return true;
  }
  void router.navigate(['/login']);
  return false;
};

export const canActivateNotLoggedRoutesFn = (): boolean => {
  const persistanceService = inject(PersistanceService);
  const router = inject(Router);
  const token = persistanceService.get('accessToken');
  if (!token) {
    return true;
  }
  void router.navigate(['/']);
  return false;
};
