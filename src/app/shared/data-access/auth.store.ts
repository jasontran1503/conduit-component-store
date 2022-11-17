import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { defer, filter, Observable, of, switchMap, tap } from 'rxjs';
import { AuthStatus, User } from './app.models';
import { AuthService } from './auth.service';

export interface AuthState {
  user: User | null;
  status: AuthStatus;
}

export const initialAuthState: AuthState = {
  status: 'idle',
  user: null
};

export interface AuthVm {
  isAuthenticated: boolean;
  user: User | null;
}

@Injectable({ providedIn: 'root' })
export class AuthStore extends ComponentStore<AuthState> {
  readonly user$ = this.select((s) => s.user);
  readonly status$ = this.select((s) => s.status);

  readonly isAuthenticated$ = this.select(
    this.status$.pipe(filter((status) => status !== 'idle')),
    (status) => status === 'authenticated',
    { debounce: true }
  );

  readonly username$ = this.select((s) => s.user?.username);

  readonly vm$: Observable<AuthVm> = this.select(
    this.isAuthenticated$,
    this.user$,
    (isAuthenticated, user) => ({ user, isAuthenticated }),
    { debounce: true }
  );

  constructor(private authService: AuthService, private router: Router) {
    super(initialAuthState);
  }

  reAuthenticated() {
    this.getCurrentUser();
    this.router.navigate(['/']);
  }

  readonly getCurrentUser = this.effect<void>(
    switchMap(() =>
      defer(() => {
        const token = localStorage.getItem('conduit-token');
        if (token) {
          return this.authService.getCurrentUser();
        }
        return of(null);
      }).pipe(
        tapResponse(
          (user) => this.patchState({ user, status: !!user ? 'authenticated' : 'unauthenticated' }),
          () => this.patchState({ user: null, status: 'unauthenticated' })
        )
      )
    )
  );

  readonly logout = this.effect<void>(
    tap(() => {
      localStorage.clear();
      this.patchState({ user: null, status: 'unauthenticated' });
      this.router.navigate(['/']);
    })
  );
}
