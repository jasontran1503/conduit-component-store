import { Injectable } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { exhaustMap, pipe, switchMap, tap, withLatestFrom } from 'rxjs';
import { CommentService } from 'src/app/shared/data-access/apis/comment.service';
import { Comment, NewComment } from 'src/app/shared/data-access/app.models';

interface CommentState {
  comments: Comment[];
  slug: string;
}

const initialCommentState: CommentState = {
  comments: [],
  slug: ''
};

@Injectable()
export class CommentStore extends ComponentStore<CommentState> {
  private readonly slug$ = this.select((s) => s.slug);

  readonly vm$ = this.select(
    this.select((s) => s.comments),
    this.slug$,
    (comments, slug) => ({ comments, slug }),
    { debounce: true }
  );

  constructor(private commentService: CommentService) {
    super(initialCommentState);
  }

  readonly getComments = this.effect<string>(
    pipe(
      tap((slug) => this.patchState({ slug })),
      switchMap((slug) =>
        this.commentService.getComments(slug).pipe(
          tapResponse(
            (comments) => this.patchState({ comments }),
            () => {}
          )
        )
      )
    )
  );

  readonly createComment = this.effect<NewComment>(
    pipe(
      withLatestFrom(this.slug$),
      exhaustMap(([comment, slug]) =>
        this.commentService.createComment(slug, comment).pipe(
          tapResponse(
            (comment) =>
              this.patchState((state) => ({
                comments: [...state.comments, comment]
              })),
            () => {}
          )
        )
      )
    )
  );

  readonly deleteComment = this.effect<number>(
    pipe(
      withLatestFrom(this.slug$),
      exhaustMap(([id, slug]) =>
        this.commentService.deleteComment(slug, id).pipe(
          tapResponse(
            () =>
              this.patchState((state) => ({
                comments: [...state.comments].filter((comment) => comment.id !== id)
              })),
            () => {}
          )
        )
      )
    )
  );
}
