import { EventEmitter, Injectable } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { exhaustMap, Observable } from 'rxjs';
import { FollowButtonService } from 'src/app/shared/data-access/apis/follow-button.service';
import { Profile } from 'src/app/shared/data-access/app.models';

@Injectable()
export class FollowButtonStore extends ComponentStore<{}> {
  constructor(private followButtonService: FollowButtonService) {
    super({});
  }

  readonly toggleFollow = this.effect(
    (params$: Observable<{ following: boolean; username: string; event: EventEmitter<Profile> }>) =>
      params$.pipe(
        exhaustMap(({ following, username, event }) =>
          this.followButtonService.toggleFollow(following, username).pipe(
            tapResponse(
              (profile) => event.emit(profile),
              () => {}
            )
          )
        )
      )
  );
}
