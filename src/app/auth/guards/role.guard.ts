import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const allowedRoles = route.data?.['roles'] as string[];
  const user = authService.getCurrentUser();

  if (!user) {
    authService.logout();
    return router.createUrlTree(['/login']);
  }

  if (!allowedRoles.includes(user.role)) {
    console.warn('Unauthorized role access. Logging out...');
    authService.logout();

    return router.createUrlTree(['/login'], {
      queryParams: { returnUrl: state.url }
    });
  }

  return true;
};
