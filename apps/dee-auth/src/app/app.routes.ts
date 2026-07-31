import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    redirectTo: 'items',
    pathMatch: 'full'
  },
  {
    path: 'items',
    loadChildren: () =>
      import('@org/feature-auth').then((m) => m.FEATURE_AUTH_ROUTES)
  }
];
