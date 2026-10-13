import { Injectable, inject } from '@angular/core';
import { select, Store } from '@ngrx/store';

import * as ScheduleActions from './schedule.actions';
import * as ScheduleSelectors from './schedule.selectors';

@Injectable()
export class ScheduleFacade {
  private readonly store = inject(Store);

  /**
   * Combine pieces of state using createSelector,
   * and expose them as observables through the facade.
   */
  loaded$ = this.store.pipe(select(ScheduleSelectors.selectScheduleLoaded));
  schedule$ = this.store.pipe(select(ScheduleSelectors.selectSchedule));
  error$ = this.store.pipe(select(ScheduleSelectors.selectScheduleError));

  /**
   * Use the initialization action to perform one
   * or more tasks in your Effects.
   */
  init() {
    this.store.dispatch(ScheduleActions.initSchedule());
  }
}
