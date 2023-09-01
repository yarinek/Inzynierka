import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { bootstrapApplication } from '@angular/platform-browser';
import { authorizationInterceptor } from '@app/core/interceptor/auth.interceptor';
import { provideRouter } from '@angular/router';
import { appRoutes } from '@app/app.routes';
import { provideState, provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { isDevMode } from '@angular/core';
import { authFeatureKey, authReducer } from '@app/content/auth/store/reducers';
import * as authEffects from '@app/content/auth/store/effects';
import { provideEffects } from '@ngrx/effects';
import { provideRouterStore, routerReducer } from '@ngrx/router-store';

import { AppComponent } from './app/app.component';

// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(withInterceptors([authorizationInterceptor])),
    provideRouter(appRoutes),
    provideStore({ router: routerReducer }),
    provideEffects(authEffects),
    provideState(authFeatureKey, authReducer),
    provideRouterStore(),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: !isDevMode(),
      autoPause: true,
      trace: false,
      traceLimit: 75,
    }),
  ],
});
