import { createAction, props } from '@ngrx/store';
import { Schedule } from './schedule.models';

export const initSchedule = createAction('[Schedule Page] Init');

export const loadScheduleSuccess = createAction(
  '[Schedule/API] Load Schedule Success',
  props<{ schedule: Schedule }>()
);

export const loadScheduleFailure = createAction(
  '[Schedule/API] Load Schedule Failure',
  props<{ error: unknown }>()
);
