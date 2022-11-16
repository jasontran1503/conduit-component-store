import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, Input, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { provideComponentStore } from '@ngrx/component-store';
import { Comment, User } from 'src/app/shared/data-access/app.models';
import { CommentStore } from './comment.store';

@Component({
  selector: 'conduit-comment[currentUser]',
  template: `<ng-container *ngIf="vm$ | async as vm">
    <form class="card comment-form" [formGroup]="form" (ngSubmit)="submit()" *ngIf="currentUser">
      <div class="card-block">
        <textarea
          class="form-control"
          placeholder="Write a comment..."
          rows="3"
          formControlName="body"
        ></textarea>
      </div>
      <div class="card-footer">
        <img
          [src]="
            currentUser ? currentUser.image : 'https://api.realworld.io/images/smiley-cyrus.jpeg'
          "
          class="comment-author-img"
        />
        <button type="submit" class="btn btn-sm btn-primary" [disabled]="form.invalid">
          Post Comment
        </button>
      </div>
    </form>

    <ng-container *ngIf="vm.comments.length">
      <div class="card" *ngFor="let comment of vm.comments">
        <div class="card-block">
          <p class="card-text">
            {{ comment.body }}
          </p>
        </div>
        <div class="card-footer">
          <a [routerLink]="['/profile', comment.author.username]" class="comment-author">
            <img [src]="comment.author.image" class="comment-author-img" />
          </a>
          &nbsp;
          <a [routerLink]="['/profile', comment.author.username]" class="comment-author">{{
            comment.author.username
          }}</a>
          <span class="date-posted">{{ comment.updatedAt | date: 'mediumDate' }}</span>
          <span
            class="mod-options"
            *ngIf="currentUser && currentUser.username === comment.author.username"
          >
            <i class="ion-trash-a" (click)="deleteComment(comment.id)"></i>
          </span>
        </div>
      </div>
    </ng-container>
  </ng-container>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, CommonModule],
  providers: [provideComponentStore(CommentStore)]
})
export class CommentComponent implements OnInit {
  @Input() currentUser!: User;
  @Input() slug = '';

  private fb = inject(FormBuilder);
  private store = inject(CommentStore);

  vm$ = this.store.vm$;
  form = this.fb.nonNullable.group({
    body: ['', Validators.required]
  });

  ngOnInit(): void {
    this.store.getComments(this.slug);
  }

  submit() {
    this.store.createComment(this.form.getRawValue());
  }

  deleteComment(id: number) {
    this.deleteComment(id);
  }
}
