import { APP_INITIALIZER } from '@angular/core';
import { AuthService } from './auth.service';

export function initAuthFactory(authService: AuthService) {
  return () => authService.initAuth();
}
