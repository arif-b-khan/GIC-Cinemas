import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';
import { BookingEffects } from './store/effects/booking.effects';
import { MovieEffects } from './store/effects/movie.effects';
import { metaReducers, reducers } from './store';
/**
 * This file replaces the NgModule with provider configuration
 * since we're using Standalone components.
 */

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(),
    provideAnimations(),
    provideRouter(routes),
    // NgRx providers
    provideStore(reducers, { metaReducers }),
    provideEffects([MovieEffects, BookingEffects]),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: environment.production
    }),

     provideClientHydration(), 
     provideAnimationsAsync()
  ]
};
