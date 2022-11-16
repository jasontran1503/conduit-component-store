import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { provideComponentStore } from '@ngrx/component-store';
import { Article, Profile } from '../shared/data-access/app.models';
import { ArticleMetaComponent } from '../shared/ui/article-meta/article-meta.component';
import { ButtonsComponent } from '../shared/ui/buttons/buttons.component';
import { ArticleStore } from './article.store';
import { CommentComponent } from './comment/comment.component';

@Component({
  selector: 'conduit-article',
  template: `<ng-container *ngIf="vm$ | async as vm">
    <ng-container *ngIf="vm.article">
      <div class="article-page">
        <div class="banner">
          <div class="container">
            <h1>{{ vm.article.title }}</h1>

            <conduit-article-meta [article]="vm.article">
              <conduit-buttons
                [isOwner]="vm.isOwner"
                [article]="vm.article"
                (toggleFavorite)="toggleFavorite($event)"
                (toggleFollow)="toggleFollow($event)"
                (deleteArticle)="deleteArticle(vm.article)"
              ></conduit-buttons>
            </conduit-article-meta>
          </div>
        </div>

        <div class="container page">
          <div class="row article-content">
            <div class="col-md-12">
              <p>{{ vm.article.body }}</p>
            </div>
          </div>

          <hr />

          <div class="article-actions">
            <conduit-article-meta [article]="vm.article">
              <conduit-buttons
                [isOwner]="vm.isOwner"
                [article]="vm.article"
                (toggleFavorite)="toggleFavorite($event)"
                (toggleFollow)="toggleFollow($event)"
                (deleteArticle)="deleteArticle(vm.article)"
              ></conduit-buttons>
            </conduit-article-meta>
          </div>

          <div class="row">
            <div class="col-xs-12 col-md-8 offset-md-2">
              <conduit-comment [currentUser]="vm.currentUser" [slug]="vm.slug"></conduit-comment>
            </div>
          </div>
        </div>
      </div>
    </ng-container>
  </ng-container> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterModule, ArticleMetaComponent, ButtonsComponent, CommentComponent],
  standalone: true,
  providers: [provideComponentStore(ArticleStore)]
})
export class ArticleComponent {
  private store = inject(ArticleStore);

  vm$ = this.store.vm$;

  toggleFavorite(article: Article) {
    // this.article = article;
  }

  toggleFollow(author: Profile) {
    // this.article = { ...this.article, author };
  }

  deleteArticle(article: Article) {
    this.store.deleteArticle(article);
  }
}
