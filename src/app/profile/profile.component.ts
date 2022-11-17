import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { provideComponentStore } from '@ngrx/component-store';
import { Profile, ProfileArticlesType } from '../shared/data-access/app.models';
import { ArticleListComponent } from '../shared/ui/article-list/article-list.component';
import { FollowButtonComponent } from '../shared/ui/buttons/follow-button/follow-button.component';
import { ProfileStore } from './profile.store';

@Component({
  selector: 'conduit-profile',
  template: `
    <ng-container *ngIf="vm$ | async as vm">
      <ng-container *ngIf="vm.profile">
        <div class="profile-page">
          <div class="user-info">
            <div class="container">
              <div class="row">
                <div class="col-xs-12 col-md-10 offset-md-1">
                  <img [src]="vm.profile.image" class="user-img" />
                  <h4>{{ vm.profile.username }}</h4>
                  <p>
                    {{ vm.profile.bio }}
                  </p>
                  <ng-container *ngIf="vm.isOwner; else nonOwner">
                    <button
                      class="btn btn-sm btn-outline-secondary action-btn"
                      routerLink="/settings"
                    >
                      <i class="ion-gear-a"></i>
                      &nbsp; Edit profile settings
                    </button>
                  </ng-container>
                  <ng-template #nonOwner>
                    <conduit-follow-button
                      [following]="vm.profile.following"
                      [username]="vm.profile.username"
                      (toggleFollow)="toggleFollow($event)"
                    ></conduit-follow-button>
                  </ng-template>
                </div>
              </div>
            </div>
          </div>

          <div class="container">
            <div class="row">
              <div class="col-xs-12 col-md-10 offset-md-1">
                <div class="articles-toggle">
                  <ul class="nav nav-pills outline-active">
                    <li class="nav-item">
                      <a
                        class="nav-link"
                        [class.active]="vm.articlesType === 'author'"
                        (click)="onSelectArticles('author')"
                        >My Articles</a
                      >
                    </li>
                    <li class="nav-item">
                      <a
                        class="nav-link"
                        [class.active]="vm.articlesType === 'favorited'"
                        (click)="onSelectArticles('favorited')"
                        >Favorited Articles</a
                      >
                    </li>
                  </ul>
                </div>
                <conduit-article-list
                  [articles]="vm.articles"
                  [loading]="vm.articlesStatus"
                ></conduit-article-list>
              </div>
            </div>
          </div>
        </div>
      </ng-container>
    </ng-container>
  `,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ArticleListComponent, FollowButtonComponent, RouterModule, CommonModule],
  providers: [provideComponentStore(ProfileStore)]
})
export class ProfileComponent {
  private store = inject(ProfileStore);

  vm$ = this.store.vm$;

  onSelectArticles(type: ProfileArticlesType) {
    this.store.getArticlesProfile(type);
  }

  toggleFollow(profile: Profile) {
    this.store.toggleFollow(profile);
  }
}
