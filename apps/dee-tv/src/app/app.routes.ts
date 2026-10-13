import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: 'schedule',
    loadChildren: () =>
      import('@org/feature-schedule').then((m) => m.featureScheduleRoutes)
  }
];
