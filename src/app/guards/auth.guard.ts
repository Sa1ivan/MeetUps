import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state): boolean => {
  const authService: AuthService = inject(AuthService);
  const router: Router = inject(Router);

  if (authService.user) {
    return true;
  }
  alert("Для просмотра записей нужно войти в аккаунт!");
  router.navigate(['nav/auth']);
  return false;
};
