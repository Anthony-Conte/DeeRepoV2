import { createFeatureSelector, createSelector } from '@ngrx/store';
import { SCHEDULE_FEATURE_KEY, ScheduleState } from './schedule.reducer';

// Lookup the 'Schedule' feature state managed by NgRx
export const selectScheduleState =
  createFeatureSelector<ScheduleState>(SCHEDULE_FEATURE_KEY);

export const selectScheduleLoaded = createSelector(
  selectScheduleState,
  (state: ScheduleState) => state.loaded
);

export const selectScheduleError = createSelector(
  selectScheduleState,
  (state: ScheduleState) => state.error
);

export const selectSchedule = createSelector(
  selectScheduleState,
  (state: ScheduleState) => state.schedule
);
