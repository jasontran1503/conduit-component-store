import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthStore } from './shared/data-access/auth.store';

@Component({
  selector: 'conduit-root',
  template: `<router-outlet></router-outlet>`,
  standalone: true,
  imports: [RouterModule, CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
  private store = inject(AuthStore);

  ngOnInit(): void {
    this.store.getCurrentUser();
  }
}
