import { Route } from '@angular/router';
import { FeatureSchedule } from './feature-schedule/feature-schedule';
import { provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import * as fromSchedule from './+state/schedule.reducer';
import { ScheduleEffects } from './+state/schedule.effects';
import { ScheduleFacade } from './+state/schedule.facade';

export const featureScheduleRoutes: Route[] = [
  {
    path: '',
    component: FeatureSchedule,
    providers: [
      ScheduleFacade,
      provideState(
        fromSchedule.SCHEDULE_FEATURE_KEY,
        fromSchedule.scheduleReducer
      ),
      provideEffects(ScheduleEffects)
    ]
  }
];
