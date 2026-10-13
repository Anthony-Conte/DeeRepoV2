import { Component, OnInit, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { ScheduleFacade } from '../+state/schedule.facade';

@Component({
  selector: 'dee-tv-feature-schedule',
  imports: [AsyncPipe],
  templateUrl: './feature-schedule.html',
  styleUrl: './feature-schedule.css'
})
export class FeatureSchedule implements OnInit {
  private readonly scheduleFacade = inject(ScheduleFacade);
  readonly schedule$ = this.scheduleFacade.schedule$;
  readonly loaded$ = this.scheduleFacade.loaded$;
  readonly error$ = this.scheduleFacade.error$;

  ngOnInit(): void {
    this.scheduleFacade.init();
  }
}
