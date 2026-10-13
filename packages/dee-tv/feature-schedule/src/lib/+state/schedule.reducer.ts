import { createReducer, on, Action } from '@ngrx/store';

import * as ScheduleActions from './schedule.actions';
import { Schedule } from './schedule.models';

export const SCHEDULE_FEATURE_KEY = 'schedule';

export interface ScheduleState {
  schedule: Schedule;
  loaded: boolean;
  error: unknown | null;
}

export interface SchedulePartialState {
  readonly [SCHEDULE_FEATURE_KEY]: ScheduleState;
}

export const initialScheduleState: ScheduleState = {
  schedule: [],
  loaded: false,
  error: null
};

const reducer = createReducer(
  initialScheduleState,
  on(ScheduleActions.initSchedule, (state) => ({
    ...state,
    loaded: false,
    error: null
  })),
  on(ScheduleActions.loadScheduleSuccess, (state, { schedule }) => ({
    ...state,
    schedule,
    loaded: true,
    error: null
  })),
  on(ScheduleActions.loadScheduleFailure, (state, { error }) => ({
    ...state,
    loaded: false,
    error
  }))
);

export function scheduleReducer(
  state: ScheduleState | undefined,
  action: Action
) {
  return reducer(state, action);
}
