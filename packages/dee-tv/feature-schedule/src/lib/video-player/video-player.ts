import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { catchError, map, merge, of, startWith, Subject, switchMap } from 'rxjs';
import { Episode } from '../+state/schedule.models';
import { ScheduleService } from '../services/schedule.service';

type VideoPlayerState =
  | { status: 'loading' }
  | { status: 'missing-id' }
  | { status: 'not-found' }
  | { status: 'error' }
  | {
      status: 'ready';
      episode: Episode;
      startAt: string | null;
      offsetObservedAt: number | null;
      channelId: string | null;
      channelName: string | null;
    };

@Component({
  selector: 'dee-tv-video-player',
  imports: [AsyncPipe, RouterLink],
  templateUrl: './video-player.html',
  styleUrl: './video-player.css'
})
export class VideoPlayer {
  private readonly route = inject(ActivatedRoute);
  private readonly scheduleService = inject(ScheduleService);
  private readonly refreshChannel$ = new Subject<void>();

  readonly state$ = merge(
    this.route.queryParamMap,
    this.refreshChannel$.pipe(map(() => this.route.snapshot.queryParamMap))
  ).pipe(
    switchMap((params) => {
      const channelId = params.get('channel');
      const videoId = params.get('video');
      const requestedStart = params.get('start');

      if (channelId) {
        return this.scheduleService.getChannelNow(channelId).pipe(
          map((program) => {
            return {
              status: 'ready' as const,
              episode: program.episode,
              startAt: String(program.startSeconds),
              offsetObservedAt: Date.now(),
              channelId,
              channelName: program.channelName
            };
          }),
          startWith<VideoPlayerState>({ status: 'loading' }),
          catchError(() => of<VideoPlayerState>({ status: 'error' }))
        );
      }

      if (!videoId) {
        return of<VideoPlayerState>({ status: 'missing-id' });
      }

      return this.scheduleService.getSchedule().pipe(
        map((episodes) => {
          const episode = episodes.find((item) => item.id === videoId);
          return episode
            ? ({
                status: 'ready',
                episode,
                startAt: requestedStart,
                offsetObservedAt: null,
                channelId: null,
                channelName: null
              } as const)
            : ({ status: 'not-found' } as const);
        }),
        startWith<VideoPlayerState>({ status: 'loading' }),
        catchError(() => of<VideoPlayerState>({ status: 'error' }))
      );
    })
  );

  seekToStart(
    video: HTMLVideoElement,
    startAt: string | null,
    offsetObservedAt: number | null
  ): void {
    if (startAt !== null) {
      const startSeconds =
        Number(startAt) +
        (offsetObservedAt === null
          ? 0
          : Math.max(0, (Date.now() - offsetObservedAt) / 1000));
      if (Number.isFinite(startSeconds) && startSeconds >= 0) {
        video.currentTime = Number.isFinite(video.duration)
          ? Math.min(startSeconds, video.duration)
          : startSeconds;
        return;
      }
    }

    if (Number.isFinite(video.duration) && video.duration > 0) {
      video.currentTime = video.duration * (0.25 + Math.random() * 0.5);
    }
  }

  playNextChannelEpisode(channelId: string | null): void {
    if (channelId) {
      this.refreshChannel$.next();
    }
  }
}
