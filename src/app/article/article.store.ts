import { exhaustMap, map, Observable, switchMap, tap } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ComponentStore, OnStateInit, tapResponse } from '@ngrx/component-store';
import { Injectable } from '@angular/core';
import { Article, User } from 'src/app/shared/data-access/app.models';
import { AuthStore } from '../shared/data-access/auth.store';
import { ArticleService } from '../shared/data-access/apis/article.service';

export interface ArticleState {
  article: Article | null;
  slug: string;
}

export const initialArticleState: ArticleState = {
  article: null,
  slug: ''
};

export type ArticleVm = ArticleState & {
  isOwner: boolean;
  currentUser: User;
};

@Injectable()
export class ArticleStore extends ComponentStore<ArticleState> implements OnStateInit {
  readonly article$ = this.select((s) => s.article);
  readonly slug$ = this.route.paramMap.pipe(map((params) => params.get('slug') as string));

  readonly vm$: Observable<ArticleVm> = this.select(
    this.authStore.user$,
    this.article$,
    this.slug$,
    (user, article, slug) => ({
      article,
      slug,
      isOwner: article?.author.username === user?.username,
      currentUser: user!
    })
  );

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authStore: AuthStore,
    private articleService: ArticleService
  ) {
    super(initialArticleState);
  }

  ngrxOnStateInit() {
    this.getArticle(this.slug$);
  }

  private readonly getArticle = this.effect<string>(
    switchMap((slug) =>
      this.articleService.getArticleBySlug(slug).pipe(
        tapResponse(
          (article) => this.patchState({ article }),
          () => {}
        )
      )
    )
  );

  readonly deleteArticle = this.effect<Article>(
    exhaustMap((article) =>
      this.articleService.deleteArticle(article.slug).pipe(
        tapResponse(
          () => this.router.navigate(['/']),
          () => {}
        )
      )
    )
  );
}
