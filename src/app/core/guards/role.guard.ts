import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const businessOwnerGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.isAuthenticated) {
    return router.createUrlTree(['/auth/login']);
  }

  if (auth.currentUser?.role === 'BusinessOwner') {
    return true;
  }

  return router.createUrlTree(['/home']);
};
