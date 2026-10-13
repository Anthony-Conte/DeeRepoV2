import { Route } from '@angular/router';
import { DeeTvShell } from './dee-tv-shell/dee-tv-shell';

export const appRoutes: Route[] = [
  {
    path: '',
    redirectTo: 'schedule',
    pathMatch: 'full'
  },
  {
    path: '**',
    component: DeeTvShell
  }
];
