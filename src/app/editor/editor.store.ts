import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ComponentStore, OnStateInit, tapResponse } from '@ngrx/component-store';
import { EMPTY, exhaustMap, map, Observable, pipe, switchMap, withLatestFrom } from 'rxjs';
import { ArticleService } from '../shared/data-access/apis/article.service';
import { EditorService } from '../shared/data-access/apis/editor.service';
import { Article, NewArticle, UpdateArticle } from '../shared/data-access/app.models';
import { AuthStore } from '../shared/data-access/auth.store';

interface EditorState {
  article: Article | null;
  errors: Record<string, string[]>;
}

const initialEditorState: EditorState = {
  article: null,
  errors: {}
};

type EditorVm = EditorState & {
  username: string;
};

@Injectable()
export class EditorStore extends ComponentStore<EditorState> implements OnStateInit {
  readonly errors$ = this.select((s) => s.errors);
  readonly article$ = this.select((s) => s.article);
  readonly slug$ = this.route.paramMap.pipe(map((params) => params.get('slug') as string));

  readonly vm$ = this.select(
    this.article$,
    this.errors$,
    this.authStore.username$,
    (article, errors, username) => ({ article, errors, username }),
    { debounce: true }
  );

  constructor(
    private authStore: AuthStore,
    private editorService: EditorService,
    private articleService: ArticleService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    super(initialEditorState);
  }

  ngrxOnStateInit() {
    this.getArticleBySlug(this.slug$);
  }

  readonly createArticle = this.effect<NewArticle>(
    exhaustMap((article) =>
      this.editorService.createArticle(article).pipe(
        tapResponse(
          (article) => this.router.navigate(['/', 'article', article.slug]),
          (err: { error: { errors: Record<string, string[]> } }) =>
            this.patchState({ errors: err.error.errors })
        )
      )
    )
  );

  readonly updateArticle = this.effect<UpdateArticle>(
    pipe(
      withLatestFrom(this.slug$),
      exhaustMap(([article, slug]) =>
        this.editorService.updateArticle(slug, article).pipe(
          tapResponse(
            (article) => this.router.navigate(['/', 'article', article.slug]),
            (err: { error: { errors: Record<string, string[]> } }) =>
              this.patchState({ errors: err.error.errors })
          )
        )
      )
    )
  );

  private readonly getArticleBySlug = this.effect((slug$: Observable<string>) =>
    slug$.pipe(
      switchMap((slug) => {
        if (slug) {
          return this.articleService.getArticleBySlug(slug);
        }
        return EMPTY;
      }),
      withLatestFrom(this.authStore.username$),
      tapResponse(
        ([article, username]) => {
          console.log(article.author.username, username);
          if (article.author.username === username) {
            this.patchState({ article });
          } else {
            this.router.navigate(['/']);
          }
        },
        () => {}
      )
    )
  );
}
