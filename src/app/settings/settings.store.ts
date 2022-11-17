import { Injectable } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { exhaustMap } from 'rxjs';
import { SettingsService } from '../shared/data-access/apis/settings.service';
import { UpdateUser } from '../shared/data-access/app.models';
import { AuthStore } from '../shared/data-access/auth.store';

@Injectable()
export class SettingsStore extends ComponentStore<{}> {
  readonly vm$ = this.select(this.authStore.user$, (user) => user, { debounce: true });

  constructor(private authStore: AuthStore, private settingsService: SettingsService) {
    super({});
  }

  readonly update = this.effect<UpdateUser>(
    exhaustMap((user) =>
      this.settingsService.update(user).pipe(
        tapResponse(
          () => this.authStore.reAuthenticated(),
          () => {}
        )
      )
    )
  );

  readonly logout = this.authStore.logout;
}
