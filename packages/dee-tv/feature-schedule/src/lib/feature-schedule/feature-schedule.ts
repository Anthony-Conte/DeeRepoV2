import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import {
  catchError,
  expand,
  map,
  Observable,
  of,
  startWith,
  switchMap,
  timer
} from 'rxjs';
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
  readonly channelState$ = this.loadChannels().pipe(
    expand((state) =>
      timer(
        state.status === 'ready' ? this.getRefreshDelay(state.channels) : 15_000
      ).pipe(switchMap(() => this.loadChannels()))
    ),
    startWith<ChannelListState>({ status: 'loading' })
  );

  private loadChannels(): Observable<ChannelListState> {
    return this.scheduleService.getChannels().pipe(
      map((channels): ChannelListState => ({ status: 'ready', channels })),
      catchError(() => of<ChannelListState>({ status: 'error' }))
    );
  }

  private getRefreshDelay(channels: Channel[]): number {
    const nextChangeAt = Math.min(
      ...channels.map((channel) => Date.parse(channel.nextChangeAt))
    );

    if (!Number.isFinite(nextChangeAt)) {
      return 15_000;
    }

    return Math.max(1_000, nextChangeAt - Date.now() + 100);
  }
}
