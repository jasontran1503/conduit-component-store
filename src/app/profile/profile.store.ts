import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ComponentStore, OnStateInit, tapResponse } from '@ngrx/component-store';
import { EMPTY, forkJoin, map, Observable, pipe, switchMap, tap, withLatestFrom } from 'rxjs';
import { ApiStatus, Article, Profile, ProfileArticlesType } from '../shared/data-access/app.models';
import { AuthStore } from '../shared/data-access/auth.store';
import { ProfileService } from './../shared/data-access/apis/profile.service';

interface ProfileState {
  profile: Profile | null;
  articles: Article[];
  isOwner: boolean;
  articlesType: ProfileArticlesType;
  articlesStatus: ApiStatus;
}

const initialProfileState: ProfileState = {
  profile: null,
  articles: [],
  isOwner: false,
  articlesType: 'author',
  articlesStatus: 'idle'
};

@Injectable()
export class ProfileStore extends ComponentStore<ProfileState> implements OnStateInit {
  readonly profile$ = this.select((s) => s.profile);
  readonly articlesType$ = this.select((s) => s.articlesType);
  readonly username$ = this.route.paramMap.pipe(map((params) => params.get('username') as string));

  readonly vm$ = this.select(
    this.authStore.username$,
    this.profile$,
    this.select((s) => s.articles),
    this.select((s) => s.isOwner),
    this.articlesType$,
    this.select((s) => s.articlesStatus),
    (currentUsername, profile, articles, isOwner, articlesType, articlesStatus) => ({
      currentUsername,
      profile,
      articles,
      isOwner,
      articlesType,
      articlesStatus
    }),
    { debounce: true }
  );

  constructor(
    private route: ActivatedRoute,
    private authStore: AuthStore,
    private profileService: ProfileService
  ) {
    super(initialProfileState);
  }

  ngrxOnStateInit() {
    this.getDataProfile(this.username$);
  }

  private readonly getDataProfile = this.effect((username$: Observable<string>) =>
    username$.pipe(
      switchMap((username) => {
        if (!username) return EMPTY;
        return forkJoin([
          this.profileService.getProfile(username),
          this.profileService.getArticles('author', username)
        ]).pipe(
          tap(() => this.patchState({ articlesStatus: 'loading' })),
          withLatestFrom(this.authStore.username$),
          tapResponse(
            ([[profile, articles], currentUsername]) =>
              this.patchState({
                articles,
                profile,
                articlesType: 'author',
                isOwner: profile.username === currentUsername,
                articlesStatus: 'success'
              }),
            () => this.patchState({ articlesStatus: 'error' })
          )
        );
      })
    )
  );

  readonly getArticlesProfile = this.effect<ProfileArticlesType>(
    pipe(
      tap((articlesType) => this.patchState({ articlesType, articlesStatus: 'loading' })),
      withLatestFrom(this.profile$),
      switchMap(([articlesType, profile]) =>
        this.profileService.getArticles(articlesType, profile!.username).pipe(
          tapResponse(
            (articles) => this.patchState({ articles, articlesStatus: 'success' }),
            () => this.patchState({ articlesStatus: 'error' })
          )
        )
      )
    )
  );

  readonly toggleFollow = this.effect<Profile>(tap((profile) => this.patchState({ profile })));
}
