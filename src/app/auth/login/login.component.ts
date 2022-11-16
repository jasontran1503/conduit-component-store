import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { provideComponentStore } from '@ngrx/component-store';
import { ErrorsFormComponent } from 'src/app/shared/ui/errors-form/errors-form.component';
import { AuthComponent } from '../auth.component';
import { LoginStore } from './login.store';

@Component({
  selector: 'conduit-login',
  template: `<conduit-auth>
    <h1 class="text-xs-center">Sign in</h1>
    <p class="text-xs-center">
      <a routerLink="/register">Need an account?</a>
    </p>

    <ng-container *ngIf="errors$ | async as errors">
      <conduit-errors-form [errors]="errors"></conduit-errors-form>
    </ng-container>

    <form [formGroup]="form" (ngSubmit)="submit()">
      <fieldset class="form-group">
        <input
          class="form-control form-control-lg"
          type="text"
          placeholder="Email"
          formControlName="email"
        />
      </fieldset>
      <fieldset class="form-group">
        <input
          class="form-control form-control-lg"
          type="password"
          placeholder="Password"
          formControlName="password"
        />
      </fieldset>
      <button type="submit" class="btn btn-lg btn-primary pull-xs-right" [disabled]="form.invalid">
        Sign in
      </button>
    </form>
  </conduit-auth>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [AuthComponent, ErrorsFormComponent, ReactiveFormsModule, RouterModule, CommonModule],
  providers: [provideComponentStore(LoginStore)]
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private store = inject(LoginStore);

  form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });
  errors$ = this.store.errors$;

  submit() {
    this.store.login(this.form.getRawValue());
  }
}
