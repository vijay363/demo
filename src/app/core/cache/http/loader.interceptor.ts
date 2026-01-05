import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn
} from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';
import { LoaderService } from '../services/loader.service';

export const loaderInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
) => {
  const loader = inject(LoaderService);

  if (req.headers.get('x-skip-loader') === 'true') {
    return next(req);
  }

  loader.show();

  return next(req).pipe(
    finalize(() => loader.hide())
  );
};
