import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { provideComponentStore } from '@ngrx/component-store';
import { tap } from 'rxjs';
import { SettingsStore } from './settings.store';

@Component({
  selector: 'conduit-settings',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-container *ngIf="vm$ | async as vm">
    <div class="settings-page">
      <div class="container page">
        <div class="row">
          <div class="col-md-6 offset-md-3 col-xs-12">
            <h1 class="text-xs-center">Your Settings</h1>

            <form [formGroup]="form" (ngSubmit)="submit()">
              <fieldset>
                <fieldset class="form-group">
                  <input
                    class="form-control"
                    type="text"
                    placeholder="URL of profile picture"
                    formControlName="image"
                  />
                </fieldset>
                <fieldset class="form-group">
                  <input
                    class="form-control form-control-lg"
                    type="text"
                    placeholder="Your Name"
                    formControlName="username"
                  />
                </fieldset>
                <fieldset class="form-group">
                  <textarea
                    class="form-control form-control-lg"
                    rows="8"
                    placeholder="Short bio about you"
                    formControlName="bio"
                  ></textarea>
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
                <button
                  type="submit"
                  class="btn btn-lg btn-primary pull-xs-right"
                  [disabled]="form.invalid"
                >
                  Update Settings
                </button>
              </fieldset>
            </form>

            <hr />

            <button class="btn btn-outline-danger" (click)="logout()">
              Or click here to logout.
            </button>
          </div>
        </div>
      </div>
    </div></ng-container
  >`,
  imports: [ReactiveFormsModule, RouterModule, CommonModule],
  providers: [provideComponentStore(SettingsStore)]
})
export class SettingsComponent {
  private fb = inject(FormBuilder);
  private store = inject(SettingsStore);

  form!: FormGroup;
  vm$ = this.store.vm$.pipe(
    tap((user) => {
      this.form = this.fb.nonNullable.group({
        image: [user ? user.image : ''],
        bio: [user ? user.bio : ''],
        email: [user ? user.email : '', [Validators.required, Validators.email]],
        username: [user ? user.username : ''],
        password: ['']
      });
    })
  );

  submit() {
    this.store.update(this.form.getRawValue());
  }

  logout() {
    this.store.logout();
  }
}
