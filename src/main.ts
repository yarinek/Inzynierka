import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
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
import * as exampleEffects from '@app/content/example-view/store/effects';
import { authActions } from '@app/content/auth/store/actions';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';
import { exampleFeatureKey, exampleReducer } from '@app/content/example-view/store/reducers';
import { settingsFeatureKey, settingsReducer } from '@app/content/settings/store/reducers';
import * as settingsEffects from '@app/content/settings/store/effects';
import * as decksEffects from '@app/content/decks/store/effects';
import * as cardsEffects from '@app/content/cards/store/effects';
import { MatSnackBarModule, MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { ToastrService } from '@app/core/services/toast.service';
import { decksFeatureKey, decksReducer } from '@app/content/decks/store/reducers';
import { cardsFeatureKey, cardsReducer } from '@app/content/cards/store/reducers';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateService } from '@ngx-translate/core';
import { MatPaginatorIntl } from '@angular/material/paginator';

import { AppComponent } from './app/app.component';

function customPaginator(): MatPaginatorIntl {
  const customPaginatorIntl = new MatPaginatorIntl();
  const translate = inject(TranslateService);

  customPaginatorIntl.itemsPerPageLabel = translate.instant('common.table.itemsPerPage') as string;

  return customPaginatorIntl;
}

function initializeAppFactory(): () => void {
  const token = localStorage.getItem('accessToken');
  const translateService = inject(TranslateService);
  translateService.addLangs(['en', 'pl']);
  translateService.setDefaultLang('pl');
  if (token) {
    const store = inject(Store);
    return () => store.dispatch(authActions.getToken());
  }
  return () => void 0;
}

function createTranslateLoader(): TranslateHttpLoader {
  const http = inject(HttpClient);
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(withInterceptors([authorizationInterceptor])),
    provideRouter(appRoutes),
    provideStore({ router: routerReducer }),
    provideEffects(authEffects, exampleEffects, settingsEffects, decksEffects, cardsEffects),
    provideState(authFeatureKey, authReducer),
    provideState(exampleFeatureKey, exampleReducer),
    provideState(settingsFeatureKey, settingsReducer),
    provideState(decksFeatureKey, decksReducer),
    provideState(cardsFeatureKey, cardsReducer),
    provideRouterStore(),
    // Devtools configuration
    provideStoreDevtools({
      maxAge: 25,
      logOnly: !isDevMode(),
      autoPause: true,
      trace: false,
      traceLimit: 75,
    }),
    { provide: APP_INITIALIZER, useFactory: initializeAppFactory, deps: [], multi: true },
    { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { duration: 2000 } },
    { provide: MatPaginatorIntl, useFactory: customPaginator },
    ToastrService,
    importProvidersFrom(
      BrowserAnimationsModule,
      MatDialogModule,
      MatSnackBarModule,
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: createTranslateLoader,
        },
      }),
    ),
  ],
});
