import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

import { SessionService } from '../services/session.service';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const session = inject(SessionService);
  const router = inject(Router);
  const token = session.accessToken();
  const isPublicClaimRequest = request.url.includes('/api/v1.0/tikves/public/ticket-claim/');
  const authenticatedRequest = token && !isPublicClaimRequest
    ? request.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : request;

  return next(authenticatedRequest).pipe(
    catchError((error: HttpErrorResponse) => {
      if (!isPublicClaimRequest && (error.status === 401 || error.status === 403)) {
        session.clearSession();
        void router.navigateByUrl('/expired');
      }

      return throwError(() => error);
    })
  );
};
