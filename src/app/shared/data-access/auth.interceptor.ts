import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpStatusCode,
  HTTP_INTERCEPTORS
} from '@angular/common/http';
import { inject, Injectable, Provider } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, EMPTY, Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = localStorage.getItem('conduit-token');

    if (token) {
      req = req.clone({
        setHeaders: {
          Authorization: `Token ${token}`
        }
      });
    }

    return next.handle(req);
  }
}

@Injectable()
export class ErrorsInterceptor implements HttpInterceptor {
  private router = inject(Router);

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((err: HttpErrorResponse) => {
        if (err.status === HttpStatusCode.Unauthorized) {
          localStorage.removeItem('conduit-token');
          this.router.navigate(['/login']);
        }
        return EMPTY;
      })
    );
  }
}

export function provideAuthInterceptor(): Provider {
  return [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorsInterceptor,
      multi: true
    }
  ];
}
