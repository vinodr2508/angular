// Milestone3 - Http Interceptors (Functional interceptor - Angular 17+ style)
// Interceptors sit between the app and the HTTP layer to inspect/modify requests
import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';

// Milestone3 - Http Interceptors (Logging every outgoing request and incoming response)
export const loggingInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  // Log the outgoing request method and URL
  console.log(`[Interceptor] ➜ ${req.method} ${req.url}`);

  // Record start time to calculate response duration
  const startTime = Date.now();

  // Milestone3 - Interceptors (Pass the request along and observe the response)
  return next(req).pipe(

    // Milestone3 - RxJS operator: tap (side effect on success response)
    tap(() => {
      const duration = Date.now() - startTime;
      console.log(`[Interceptor] ✔ ${req.url} completed in ${duration}ms`);
    }),

    // Milestone3 - Http Interceptors (Global error handling for all HTTP calls)
    catchError((error: HttpErrorResponse) => {
      // Log the error details
      console.error(`[Interceptor] ✖ HTTP Error ${error.status}: ${error.message}`);

      // You can show a toast/snackbar here in a real app
      // For now, just re-throw so components can handle it too
      return throwError(() => error);
    })
  );
};
