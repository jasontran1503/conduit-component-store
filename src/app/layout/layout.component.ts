import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthStore } from '../shared/data-access/auth.store';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';

@Component({
  selector: 'conduit-layout',
  template: `
    <ng-container *ngIf="vm$ | async as vm">
      <conduit-header
        [isAuthenticated]="vm.isAuthenticated"
        [username]="vm.user?.username"
      ></conduit-header>
      <router-outlet></router-outlet>
      <conduit-footer></conduit-footer>
    </ng-container>
  `,
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, FooterComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LayoutComponent {
  private store = inject(AuthStore);

  vm$ = this.store.vm$;
}
