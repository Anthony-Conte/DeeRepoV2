import { Injectable, inject } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { switchMap, catchError, of } from 'rxjs';
import * as ScheduleActions from './schedule.actions';

@Injectable()
export class ScheduleEffects {
  private actions$ = inject(Actions);

  init$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ScheduleActions.initSchedule),
      switchMap(() =>
        of(ScheduleActions.loadScheduleSuccess({ schedule: [] }))
      ),
      catchError((error) => {
        console.error('Error', error);
        return of(ScheduleActions.loadScheduleFailure({ error }));
      })
    )
  );
}
