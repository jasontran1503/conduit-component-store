import { inject, Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, CanLoad, Router } from '@angular/router';
import { take } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthStore } from './auth.store';

@Injectable({ providedIn: 'root' })
export class NonAuthGuard implements CanActivate, CanActivateChild, CanLoad {
  private authStore = inject(AuthStore);
  private router = inject(Router);

  canLoad() {
    return this.isAuthenticated();
  }

  canActivate() {
    return this.isAuthenticated();
  }

  canActivateChild() {
    return this.isAuthenticated();
  }

  private isAuthenticated() {
    return this.authStore.isAuthenticated$.pipe(
      map((isAuthenticated) => {
        if (!isAuthenticated) return !isAuthenticated;
        return this.router.parseUrl('/');
      }),
      take(1)
    );
  }
}
