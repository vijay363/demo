import { APP_INITIALIZER, ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { PreloadAllModules, provideRouter, withPreloading } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';

import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';
import { AuthService } from './auth/services/auth.service';
import { loaderInterceptor } from './core/cache/http/loader.interceptor';
import { ThemeService } from './core/cache/services/theme.service';
import { initThemeFactory } from './core/cache/initializers/theme.initializer';
import { authInterceptor } from './auth/interceptors/auth.interceptor';
import { initAuthFactory } from './auth/initializers/auth.initializer';
import { cacheInterceptor } from './core/cache/cache/cache.interceptor';


export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),

    provideRouter(routes, withPreloading(PreloadAllModules)),

    provideHttpClient(withInterceptors([loaderInterceptor, authInterceptor,cacheInterceptor])),

    providePrimeNG({
      theme: {
        preset: Aura,
      },
    }),

    provideAnimations(),

    provideToastr({
      positionClass: 'toast-top-right',
      timeOut: 3000,
      closeButton: true,
      progressBar: true,
      preventDuplicates: true,
    }),

    {
      provide: APP_INITIALIZER,
      useFactory: initAuthFactory,
      deps: [AuthService],
      multi: true,
    },
      {
      provide: APP_INITIALIZER,
      useFactory: initThemeFactory,
      deps: [ThemeService],
      multi: true,
    },
  ],
};

