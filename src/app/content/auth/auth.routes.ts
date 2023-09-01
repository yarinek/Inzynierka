import { Route } from '@angular/router';

import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';

export const registerRoutes: Route[] = [
  {
    path: '',
    component: RegisterComponent,
  },
];

export const loginRoutes: Route[] = [
  {
    path: '',
    component: LoginComponent,
  },
];
