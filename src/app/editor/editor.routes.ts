import { Routes } from '@angular/router';

export const editorRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./editor.component').then((m) => m.EditorComponent)
  },
  {
    path: ':slug',
    loadComponent: () => import('./editor.component').then((m) => m.EditorComponent)
  }
];
