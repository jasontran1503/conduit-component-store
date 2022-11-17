import { EventEmitter, Injectable } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { exhaustMap, Observable } from 'rxjs';
import { FavoriteButtonService } from 'src/app/shared/data-access/apis/favorite-button.service';
import { Article } from 'src/app/shared/data-access/app.models';

@Injectable()
export class FavoriteButtonStore extends ComponentStore<{}> {
  constructor(private favoriteButtonService: FavoriteButtonService) {
    super({});
  }

  readonly toggleFavorite = this.effect(
    (params$: Observable<{ isFavorited: boolean; slug: string; event: EventEmitter<Article> }>) =>
      params$.pipe(
        exhaustMap(({ isFavorited, slug, event }) =>
          this.favoriteButtonService.toggleFavorite(isFavorited, slug).pipe(
            tapResponse(
              (article) => event.emit(article),
              () => {}
            )
          )
        )
      )
  );
}
