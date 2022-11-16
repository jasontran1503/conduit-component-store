import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { ApiStatus } from 'src/app/shared/data-access/app.models';

@Component({
  selector: 'conduit-tags',
  template: `<ng-container *ngIf="loading !== 'loading'; else loadingTpl"
      ><ng-container *ngIf="tags.length" ; else noTags>
        <div class="tag-list">
          <a class="tag-pill tag-default" *ngFor="let tag of tags" (click)="onSelectTag(tag)">{{
            tag
          }}</a>
        </div></ng-container
      ></ng-container
    >

    <ng-template #loadingTpl>
      <div class="tag-list">Loading...</div>
    </ng-template>

    <ng-template #noTags>
      <div class="tag-list">No tags...yet</div>
    </ng-template> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule]
})
export class TagsComponent {
  @Input() tags: string[] = [];
  @Input() loading: ApiStatus = 'idle';
  @Output() selectTag = new EventEmitter<string>();

  onSelectTag(tag: string) {
    this.selectTag.emit(tag);
  }
}
