import { Component, OnInit, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { catchError, of } from 'rxjs';
import { ScheduleFacade } from '../+state/schedule.facade';
import { ScheduleService } from '../services/schedule.service';
import { Channel } from '../+state/schedule.models';

@Component({
  selector: 'dee-tv-feature-schedule',
  imports: [AsyncPipe, RouterLink],
  templateUrl: './feature-schedule.html',
  styleUrl: './feature-schedule.css'
})
export class FeatureSchedule implements OnInit {
  private readonly scheduleFacade = inject(ScheduleFacade);
  private readonly scheduleService = inject(ScheduleService);
  readonly schedule$ = this.scheduleFacade.schedule$;
  readonly loaded$ = this.scheduleFacade.loaded$;
  readonly error$ = this.scheduleFacade.error$;
  readonly channels$ = this.scheduleService
    .getChannels()
    .pipe(catchError(() => of([] as Channel[])));

  ngOnInit(): void {
    this.scheduleFacade.init();
  }
}
