import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    redirectTo: 'items',
    pathMatch: 'full',
  },
  {
    path: 'items',
    loadComponent: () =>
      import('@org/feature-items').then((m) => m.FeatureItems),
  },
];
