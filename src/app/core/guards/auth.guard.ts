import { inject } from '@angular/core';
import { Router } from '@angular/router';

// Since Angular 14 we can use functional guards and it is recommended.

export const canActivateLoggedRoutesFn = (): boolean => {
  const router = inject(Router);
  const token = localStorage.getItem('accessToken');
  if (token) {
    return true;
  }
  void router.navigate(['/login']);
  return false;
};

export const canActivateNotLoggedRoutesFn = (): boolean => {
  const router = inject(Router);
  const token = localStorage.getItem('accessToken');
  if (!token) {
    return true;
  }
  void router.navigate(['/']);
  return false;
};
