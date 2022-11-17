import { Injectable } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { exhaustMap } from 'rxjs';
import { LoginService } from 'src/app/shared/data-access/apis/login.service';
import { LoginUser } from 'src/app/shared/data-access/app.models';
import { AuthStore } from 'src/app/shared/data-access/auth.store';

interface LoginState {
  errors: Record<string, string[]>;
}

const initialLoginState: LoginState = {
  errors: {}
};

@Injectable()
export class LoginStore extends ComponentStore<LoginState> {
  readonly errors$ = this.select((s) => s.errors, { debounce: true });

  constructor(private loginService: LoginService, private authStore: AuthStore) {
    super(initialLoginState);
  }

  readonly login = this.effect<LoginUser>(
    exhaustMap((loginUser) =>
      this.loginService.login(loginUser).pipe(
        tapResponse(
          () => this.authStore.reAuthenticated(),
          (err: { error: { errors: Record<string, string[]> } }) =>
            this.patchState({ errors: err.error.errors })
        )
      )
    )
  );
}
