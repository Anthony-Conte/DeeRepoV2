import { Injectable, inject } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import * as ScheduleActions from './schedule.actions';
import { ScheduleService } from '../services/schedule.service';

@Injectable()
export class ScheduleEffects {
  private readonly actions$ = inject(Actions);
  private readonly scheduleService = inject(ScheduleService);

  init$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ScheduleActions.initSchedule),
      switchMap(() =>
        this.scheduleService.getSchedule().pipe(
          map((schedule) => ScheduleActions.loadScheduleSuccess({ schedule })),
          catchError((error: unknown) =>
            of(ScheduleActions.loadScheduleFailure({ error }))
          )
        )
      )
    )
  );
}
