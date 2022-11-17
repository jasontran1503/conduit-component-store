import { Injectable } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { exhaustMap } from 'rxjs';
import { RegisterService } from 'src/app/shared/data-access/apis/register.service';
import { NewUser } from 'src/app/shared/data-access/app.models';
import { AuthStore } from 'src/app/shared/data-access/auth.store';

interface RegisterState {
  errors: Record<string, string[]>;
}

const initialRegisterState: RegisterState = {
  errors: {}
};

@Injectable()
export class RegisterStore extends ComponentStore<RegisterState> {
  readonly errors$ = this.select((s) => s.errors, { debounce: true });

  constructor(private registerService: RegisterService, private authStore: AuthStore) {
    super(initialRegisterState);
  }

  readonly register = this.effect<NewUser>(
    exhaustMap((user) =>
      this.registerService.register(user).pipe(
        tapResponse(
          () => this.authStore.reAuthenticated(),
          (err: { error: { errors: Record<string, string[]> } }) => {
            console.log(err);
            this.patchState({ errors: err.error.errors });
          }
        )
      )
    )
  );
}
