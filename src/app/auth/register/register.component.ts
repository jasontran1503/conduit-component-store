import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { provideComponentStore } from '@ngrx/component-store';
import { ErrorsFormComponent } from 'src/app/shared/ui/errors-form/errors-form.component';
import { AuthComponent } from '../auth.component';
import { RegisterStore } from './register.store';

@Component({
  selector: 'conduit-register',
  template: `<conduit-auth>
    <h1 class="text-xs-center">Sign up</h1>
    <p class="text-xs-center">
      <a routerLink="/login">Have an account?</a>
    </p>

    <ng-container *ngIf="errors$ | async as errors">
      <conduit-errors-form [errors]="errors"></conduit-errors-form>
    </ng-container>

    <form [formGroup]="form" (ngSubmit)="submit()">
      <fieldset class="form-group">
        <input
          class="form-control form-control-lg"
          type="text"
          placeholder="Your Name"
          formControlName="username"
        />
      </fieldset>
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
        Sign up
      </button>
    </form>
  </conduit-auth>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [AuthComponent, ErrorsFormComponent, ReactiveFormsModule, RouterModule, CommonModule],
  providers: [provideComponentStore(RegisterStore)]
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private store = inject(RegisterStore);

  form = this.fb.nonNullable.group({
    username: ['', [Validators.required]],
    email: ['', [Validators.required]],
    password: ['', [Validators.required]]
  });
  errors$ = this.store.errors$;

  submit() {
    this.store.register(this.form.getRawValue());
  }
}
