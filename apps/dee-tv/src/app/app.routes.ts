import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    redirectTo: 'schedule',
    pathMatch: 'full'
  },
  {
    path: 'schedule',
    loadChildren: () =>
      import('@org/feature-schedule').then((m) => m.featureScheduleRoutes)
  },
  {
    path: 'watch',
    loadChildren: () =>
      import('@org/feature-schedule').then((m) => m.featureVideoRoutes)
  }
];
