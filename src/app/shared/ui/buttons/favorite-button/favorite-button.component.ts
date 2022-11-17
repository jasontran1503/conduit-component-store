import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Input,
  Output
} from '@angular/core';
import { provideComponentStore } from '@ngrx/component-store';
import { Article } from 'src/app/shared/data-access/app.models';
import { FavoriteButtonStore } from './favorite-button.store';

@Component({
  selector: 'conduit-favorite-button',
  template: `<button
    class="btn btn-sm"
    [ngClass]="isFavorited ? 'btn-primary' : 'btn-outline-primary'"
    (click)="click()"
  >
    <i class="ion-heart"></i>&nbsp;
    <ng-content></ng-content>
  </button>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule],
  providers: [provideComponentStore(FavoriteButtonStore)]
})
export class FavoriteButtonComponent {
  @Input() isFavorited = false;
  @Input() slug = '';
  @Output() toggleFavorite = new EventEmitter<Article>();

  private store = inject(FavoriteButtonStore);

  click() {
    this.store.toggleFavorite({
      isFavorited: this.isFavorited,
      slug: this.slug,
      event: this.toggleFavorite
    });
  }
}
