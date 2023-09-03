import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { bootstrapApplication } from '@angular/platform-browser';
import { authorizationInterceptor } from '@app/core/interceptor/auth.interceptor';
import { provideRouter } from '@angular/router';
import { appRoutes } from '@app/app.routes';
import { Store, provideState, provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { isDevMode, inject, APP_INITIALIZER, importProvidersFrom } from '@angular/core';
import { authFeatureKey, authReducer } from '@app/content/auth/store/reducers';
import * as authEffects from '@app/content/auth/store/effects';
import { provideEffects } from '@ngrx/effects';
import { provideRouterStore, routerReducer } from '@ngrx/router-store';
import { feedFeatureKey, feedReducer } from '@app/content/globalFeed/store/reducers';
import * as feedEffects from '@app/content/globalFeed/store/effects';
import * as popularTagsEffects from '@app/shared/components/popular-tags/store/effects';
import { popularTagsFeatureKey, popularTagsReducer } from '@app/shared/components/popular-tags/store/reducers';
import { authActions } from '@app/content/auth/store/actions';
import { PersistanceService } from '@app/core/services/persistance.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app/app.component';

function initializeAppFactory(): () => void {
  const persistanceService = inject(PersistanceService);
  const token = persistanceService.get('accessToken');
  if (token) {
    const store = inject(Store);
    return () => store.dispatch(authActions.getCurrentUser());
  }
  return () => void 0;
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(withInterceptors([authorizationInterceptor])),
    provideRouter(appRoutes),
    provideStore({ router: routerReducer }),
    provideEffects(authEffects, feedEffects, popularTagsEffects),
    provideState(authFeatureKey, authReducer),
    provideState(feedFeatureKey, feedReducer),
    provideState(popularTagsFeatureKey, popularTagsReducer),
    provideRouterStore(),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: !isDevMode(),
      autoPause: true,
      trace: false,
      traceLimit: 75,
    }),
    { provide: APP_INITIALIZER, useFactory: initializeAppFactory, deps: [], multi: true },
    importProvidersFrom(BrowserAnimationsModule),
  ],
});
