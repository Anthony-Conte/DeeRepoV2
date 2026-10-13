import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { catchError, map, of, startWith } from 'rxjs';
import { DeeTile } from '@org/shared-ui';
import { ScheduleService } from '../services/schedule.service';
import { Channel } from '../+state/schedule.models';

type ChannelListState =
  | { status: 'loading' }
  | { status: 'ready'; channels: Channel[] }
  | { status: 'error' };

@Component({
  selector: 'dee-tv-feature-schedule',
  imports: [AsyncPipe, RouterLink, DeeTile],
  templateUrl: './feature-schedule.html',
  styleUrl: './feature-schedule.css'
})
export class FeatureSchedule {
  private readonly route = inject(ActivatedRoute);
  private readonly scheduleService = inject(ScheduleService);
  readonly activeChannelId$ = this.route.queryParamMap.pipe(
    map((params) => params.get('channel'))
  );
  readonly channelState$ = this.scheduleService.getChannels().pipe(
    map((channels): ChannelListState => ({ status: 'ready', channels })),
    startWith<ChannelListState>({ status: 'loading' }),
    catchError(() => of<ChannelListState>({ status: 'error' }))
  );
}
