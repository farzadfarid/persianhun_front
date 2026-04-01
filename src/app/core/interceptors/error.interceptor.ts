import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toast = inject(ToastService);
  const auth = inject(AuthService);
  const silent = req.headers.has('X-Silent-Error');

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (!silent) {
        if (error.status === 401) {
          auth.logout();
          toast.error('Session expired. Please log in again.', 'Unauthorized');
        } else if (error.status === 403) {
          toast.error('You do not have permission to perform this action.', 'Forbidden');
        } else if (error.status === 0) {
          toast.error('Cannot connect to the server. Please try again.', 'Connection Error');
        } else {
          const message =
            error.error?.detail ??
            error.error?.title ??
            error.message ??
            'An unexpected error occurred.';
          toast.error(message, 'Error');
        }
      }

      return throwError(() => error);
    })
  );
};
