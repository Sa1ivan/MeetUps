import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export const adminGuard: CanActivateFn = (route, state): boolean => {
  const authService: AuthService = inject(AuthService);
  const router: Router = inject(Router);

  if (authService.token) {
    if(authService.user && authService.user.roles[0].name == 'ADMIN')
    {
        return true;
    }
    router.navigate(['nav/all']);
  }
  else
  {
    alert("У вас нет полномочий для экрана 'Пользователи'!");
    router.navigate(['']);
  }
  return false;
};
