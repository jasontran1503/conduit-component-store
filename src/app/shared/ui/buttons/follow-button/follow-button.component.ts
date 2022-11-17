import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Input,
  Output
} from '@angular/core';
import { provideComponentStore } from '@ngrx/component-store';
import { Profile } from 'src/app/shared/data-access/app.models';
import { FollowButtonStore } from './follow-button.store';

@Component({
  selector: 'conduit-follow-button',
  template: `<button class="btn btn-sm btn-outline-secondary action-btn" (click)="click()">
    <i class="ion-plus-round"></i>
    &nbsp; {{ following ? 'Unfollow' : 'Follow' }} {{ username }}
  </button>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [],
  providers: [provideComponentStore(FollowButtonStore)]
})
export class FollowButtonComponent {
  @Input() following = false;
  @Input() username = '';
  @Output() toggleFollow = new EventEmitter<Profile>();

  private store = inject(FollowButtonStore);

  click() {
    this.store.toggleFollow({
      following: this.following,
      username: this.username,
      event: this.toggleFollow
    });
  }
}
