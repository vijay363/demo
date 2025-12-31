import {
  HttpErrorResponse,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  throwError,
  switchMap,
  filter,
  take,
} from 'rxjs';
import { AuthService } from './auth.service';

const isRefreshing = {
  value: false,
};
const refreshTokenSubject = new BehaviorSubject<string | null>(null);

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
) => {
  const authService = inject(AuthService);

  const accessToken = authService.getAccessToken();
  let authReq = req;

  if (accessToken) {
    authReq = addAuthHeader(req, accessToken);
  }

  return next(authReq).pipe(
    catchError((error) => {
      if (error instanceof HttpErrorResponse && error.status === 401) {
        return handle401(authReq, next, authService);
      }
      return throwError(() => error);
    })
  );

function addAuthHeader(req: HttpRequest<any>, token: string): HttpRequest<any> {
  return req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });
}

function handle401(
  request: HttpRequest<any>,
  next: HttpHandlerFn,
  authService: AuthService
) {
  if (!isRefreshing.value) {
    isRefreshing.value = true;
    refreshTokenSubject.next(null);

    const refresh$ = authService.refreshToken();
    if (!refresh$) {
      authService.logout();
      isRefreshing.value = false;
      return throwError(() => new Error('No refresh token'));
    }

    return refresh$.pipe(
      switchMap((tokens) => {
        isRefreshing.value = false;

        refreshTokenSubject.next(tokens.access_token);

        return next(addAuthHeader(request, tokens.access_token));
      }),
      catchError((err) => {
        isRefreshing.value = false;
        authService.logout();
        return throwError(() => err);
      })
    );
  } else {
    return refreshTokenSubject.pipe(
      filter((token) => token !== null),
      take(1),
      switchMap((token) => next(addAuthHeader(request, token!)))
    );
  }
}
};
