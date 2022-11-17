import { Injectable } from '@angular/core';
import { ComponentStore, OnStateInit, tapResponse } from '@ngrx/component-store';
import { defer, filter, Observable, pipe, switchMap, tap } from 'rxjs';
import { HomeService } from '../shared/data-access/apis/home.service';
import { ApiStatus, Article, FeedType, TagsResponse } from '../shared/data-access/app.models';
import { AuthStore } from '../shared/data-access/auth.store';

interface HomeState {
  articles: Article[];
  tags: TagsResponse['tags'];
  feedType: FeedType;
  selectedTag: string;
  articlesStatus: ApiStatus;
  tagsStatus: ApiStatus;
}

const initialHomeState: HomeState = {
  articles: [],
  tags: [],
  feedType: 'global',
  selectedTag: '',
  articlesStatus: 'idle',
  tagsStatus: 'idle'
};

type HomeVm = HomeState & {
  isAuthenticated: boolean;
};

@Injectable()
export class HomeStore extends ComponentStore<HomeState> implements OnStateInit {
  readonly vm$: Observable<HomeVm> = this.select(
    this.authStore.isAuthenticated$,
    this.select((s) => s.articles),
    this.select((s) => s.tags),
    this.select((s) => s.feedType),
    this.select((s) => s.selectedTag),
    this.select((s) => s.articlesStatus).pipe(filter((s) => s !== 'idle')),
    this.select((s) => s.tagsStatus).pipe(filter((s) => s !== 'idle')),
    (isAuthenticated, articles, tags, feedType, selectedTag, articlesStatus, tagsStatus) => ({
      isAuthenticated,
      articles,
      tags,
      feedType,
      selectedTag,
      articlesStatus,
      tagsStatus
    }),
    { debounce: true }
  );

  constructor(private authStore: AuthStore, private homeService: HomeService) {
    super(initialHomeState);
  }

  ngrxOnStateInit() {
    this.getTags();
    this.getArticles('global');
  }

  readonly getTags = this.effect<void>(
    pipe(
      tap(() => this.patchState({ tagsStatus: 'loading' })),
      switchMap(() =>
        this.homeService.getTags().pipe(
          tapResponse(
            (tags) => this.patchState({ tags, tagsStatus: 'success' }),
            () => this.patchState({ tagsStatus: 'error' })
          )
        )
      )
    )
  );

  readonly getArticles = this.effect((feedType$: Observable<FeedType>) =>
    feedType$.pipe(
      tap(() => this.patchState({ articlesStatus: 'loading', selectedTag: '' })),
      switchMap((feedType) =>
        defer(() => {
          if (feedType === 'feed') {
            return this.homeService.getYourFeed();
          }
          return this.homeService.getGlobalFeed();
        }).pipe(
          tapResponse(
            (articles) => this.patchState({ articles, articlesStatus: 'success' }),
            () => this.patchState({ articlesStatus: 'error' })
          )
        )
      )
    )
  );

  readonly getArticlesByTag = this.effect((selectedTag$: Observable<string>) =>
    selectedTag$.pipe(
      tap((selectedTag) => this.patchState({ articlesStatus: 'loading', selectedTag })),
      switchMap((selectedTag) =>
        this.homeService.getArticlesByTag(selectedTag).pipe(
          tapResponse(
            (articles) => this.patchState({ articles, articlesStatus: 'success' }),
            () => this.patchState({ articlesStatus: 'error' })
          )
        )
      )
    )
  );
}
