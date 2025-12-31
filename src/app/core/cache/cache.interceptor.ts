import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { of, tap } from 'rxjs';
import { CacheService } from './cache.service';
import { AuthService } from '../../auth/auth.service';

export const cacheInterceptor: HttpInterceptorFn = (req, next) => {
  const cache = inject(CacheService);
  const authService = inject(AuthService);

  if (req.method !== 'GET') {
    return next(req);
  }

  if (req.headers.get('x-skip-cache') === 'true') {
    return next(req);
  }

  const role = authService.getDecodedToken()?.role;

  if (req.url.includes('/users') && role !== 'admin') {
    return next(req);
  }

  const userKey = authService.getDecodedToken()?.sub ?? 'guest';

  const cacheKey = `${userKey}::${req.urlWithParams}`;

  const ttl = req.headers.get('x-cache-ttl')
    ? Number(req.headers.get('x-cache-ttl'))
    : undefined;

  const cached = cache.get(cacheKey);
  if (cached) {
    return of(cached);
  }

  return next(req).pipe(
    tap((event) => {
      if (event instanceof HttpResponse && event.status === 200) {
        cache.set(cacheKey, event, ttl);
      }
    })
  );
};
