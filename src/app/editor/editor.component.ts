import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { provideComponentStore } from '@ngrx/component-store';
import { tap } from 'rxjs';
import { ErrorsFormComponent } from 'src/app/shared/ui/errors-form/errors-form.component';
import { Article } from '../shared/data-access/app.models';
import { EditorStore } from './editor.store';

@Component({
  selector: 'conduit-editor',
  template: `<ng-container *ngIf="vm$ | async as vm">
    <div class="editor-page">
      <div class="container page">
        <div class="row">
          <div class="col-md-10 offset-md-1 col-xs-12">
            <ng-container *ngIf="vm.errors">
              <conduit-errors-form [errors]="vm.errors"></conduit-errors-form>
            </ng-container>
            <form [formGroup]="form">
              <fieldset>
                <fieldset class="form-group">
                  <input
                    type="text"
                    class="form-control form-control-lg"
                    placeholder="Article Title"
                    formControlName="title"
                  />
                </fieldset>
                <fieldset class="form-group">
                  <input
                    type="text"
                    class="form-control"
                    placeholder="What's this article about?"
                    formControlName="description"
                  />
                </fieldset>
                <fieldset class="form-group">
                  <textarea
                    class="form-control"
                    rows="8"
                    placeholder="Write your article (in markdown)"
                    formControlName="body"
                  ></textarea>
                </fieldset>
                <fieldset class="form-group">
                  <input
                    #tagInput
                    type="text"
                    class="form-control"
                    placeholder="Enter tags"
                    (keyup.enter)="addTag(tagInput)"
                  />
                  <div class="tag-list" *ngIf="form.value.tagList?.length">
                    <span class="tag-pill tag-default" *ngFor="let tag of form.value?.tagList">
                      <i class="ion-close-round" (click)="removeTag(tag)"></i>
                      {{ ' ' + tag }}
                    </span>
                  </div>
                </fieldset>
                <button
                  class="btn btn-lg pull-xs-right btn-primary"
                  type="button"
                  (click)="submit()"
                >
                  Publish Article
                </button>
              </fieldset>
            </form>
          </div>
        </div>
      </div>
    </div>
  </ng-container> `,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, RouterModule, CommonModule, ErrorsFormComponent],
  providers: [provideComponentStore(EditorStore)]
})
export class EditorComponent {
  private fb = inject(FormBuilder);
  private store = inject(EditorStore);
  private article: Article | null = null;

  form!: FormGroup;
  vm$ = this.store.vm$.pipe(
    tap(({ article }) => {
      this.article = article;
      this.form = this.fb.nonNullable.group({
        title: [article ? article.title : '', [Validators.required]],
        description: [article ? article.description : '', [Validators.required]],
        body: [article ? article.body : '', [Validators.required]],
        tagList: [article ? article.tagList : <string[]>[]]
      });
    })
  );

  submit() {
    const formValue = this.form.getRawValue();
    if (this.article) {
      this.store.updateArticle(formValue);
    } else {
      this.store.createArticle(formValue);
    }
  }

  addTag(tagInput: HTMLInputElement) {
    if (tagInput.value.trim()) {
      this.form.patchValue({
        tagList: [...this.form.get('tagList')?.value, tagInput.value.trim()]
      });
      tagInput.value = '';
    }
  }

  removeTag(tagRemove: string) {
    this.form.patchValue({
      tagList: this.form.get('tagList')?.value.filter((tag: string) => tag !== tagRemove)
    });
  }
}
