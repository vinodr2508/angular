// Milestone2 - Routing (provideRouter sets up app-level routes)
// Milestone3 - HTTP calls using HttpClient (provideHttpClient enables HttpClient DI)
// Milestone3 - Http Interceptors (withInterceptors registers our logging interceptor)
// Milestone4 - Deployment / CSR (This is the standard Client-Side Rendering bootstrap)
import { ApplicationConfig } from '@angular/core';
import { provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { loggingInterceptor } from './interceptors/logging.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [

    // Milestone2 - Routing (Register routes + preloading strategy)
    // Milestone2 - Preloading strategy (PreloadAllModules loads lazy modules in background)
    provideRouter(routes, withPreloading(PreloadAllModules)),

    // Milestone3 - HttpClient (Enables HttpClient injection throughout the app)
    // Milestone3 - Http Interceptors (withInterceptors registers the logging interceptor)
    provideHttpClient(
      withInterceptors([loggingInterceptor])
    ),

    // Milestone4 - Angular Internationalization (i18n)
    // To add i18n: run `ng add @angular/localize` then use the $localize tag
    // Example in template: <h1 i18n="@@dashboardTitle">Dashboard</h1>
    // Then run: ng extract-i18n  (generates messages.xlf)
    // Add locale files: src/locale/messages.fr.xlf etc.
    // Build with locale: ng build --localize
    // No provider needed here for basic compile-time i18n

  ]
};

/*
  Milestone4 - CSR vs SSR vs SSG explanation:

  CSR (Client-Side Rendering) — DEFAULT (this file)
  - Angular app boots in the browser
  - Initial HTML is nearly empty; JS renders everything
  - Good for: dashboards, admin tools, authenticated apps
  - ng build  →  produces static files served by any web server

  SSR (Server-Side Rendering) — Angular Universal
  - Server renders the initial HTML, then Angular hydrates it
  - Good for: SEO-important public pages
  - ng add @angular/ssr  →  adds server.ts and hydration
  - provideClientHydration() is added to providers

  SSG (Static Site Generation)
  - Pages pre-rendered at build time (no server needed at runtime)
  - Good for: blogs, docs, marketing pages
  - Can be combined with Angular Universal using prerender

  Hybrid Rendering (Angular 17+)
  - Route-level rendering strategy
  - Some routes CSR, some SSR, some SSG in the same app
*/
