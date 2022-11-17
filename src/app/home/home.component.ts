import { provideComponentStore } from '@ngrx/component-store';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DestroyService } from '../shared/data-access/destroy.service';
import { ArticleListComponent } from '../shared/ui/article-list/article-list.component';
import { FeedComponent } from './feed/feed.component';
import { HomeService } from '../shared/data-access/apis/home.service';
import { TagsComponent } from './tags/tags.component';
import { FeedType } from '../shared/data-access/app.models';
import { HomeStore } from './home.store';

@Component({
  selector: 'conduit-home',
  template: `<ng-container *ngIf="vm$ | async as vm">
    <div class="home-page">
      <div class="banner">
        <div class="container">
          <h1 class="logo-font">conduit</h1>
          <p>A place to share your knowledge.</p>
        </div>
      </div>

      <div class="container page">
        <div class="row">
          <div class="col-md-9">
            <conduit-feed
              (selectFeed)="selectFeed($event)"
              [selectedTag]="vm.selectedTag"
              [isAuthenticated]="vm.isAuthenticated"
            ></conduit-feed>

            <conduit-article-list
              [articles]="vm.articles"
              [status]="vm.articlesStatus"
            ></conduit-article-list>
          </div>

          <div class="col-md-3">
            <div class="sidebar">
              <p>Popular Tags</p>
              <conduit-tags
                [tags]="vm.tags"
                [status]="vm.tagsStatus"
                (selectTag)="selectTag($event)"
              ></conduit-tags>
            </div>
          </div>
        </div>
      </div></div
  ></ng-container>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [TagsComponent, ArticleListComponent, FeedComponent, CommonModule],
  providers: [provideComponentStore(HomeStore)]
})
export class HomeComponent {
  private store = inject(HomeStore);

  vm$ = this.store.vm$;

  selectFeed(feed: FeedType) {
    this.store.getArticles(feed);
  }

  selectTag(tag: string) {
    this.store.getArticlesByTag(tag);
  }
}
