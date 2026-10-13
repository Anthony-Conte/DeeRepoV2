import { Component, OnInit, inject } from '@angular/core';
import { ScheduleFacade } from '../+state/schedule.facade';

@Component({
  selector: 'dee-tv-feature-schedule',
  imports: [],
  templateUrl: './feature-schedule.html',
  styleUrl: './feature-schedule.css'
})
export class FeatureSchedule implements OnInit {
  private readonly scheduleFacade = inject(ScheduleFacade);

  ngOnInit(): void {
    this.scheduleFacade.init();
  }
}
