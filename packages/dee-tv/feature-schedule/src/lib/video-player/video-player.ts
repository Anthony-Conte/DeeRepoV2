import { AsyncPipe } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
  imports: [AsyncPipe],
  templateUrl: './video-player.html',
  styleUrl: './video-player.css'
})
export class VideoPlayer {
  @Input() guideMode = false;

  private readonly route = inject(ActivatedRoute);
  private readonly scheduleService = inject(ScheduleService);
  private readonly nextEpisode$ = new Subject<{
    channelId: string;
    episodeId: string;
  }>();

  readonly state$ = merge(
    this.route.queryParamMap.pipe(
      map((params) => ({ kind: 'tune' as const, params }))
    ),
    this.nextEpisode$.pipe(
      map((selection) => ({ kind: 'next' as const, selection }))
    )
  ).pipe(
    switchMap((request) => {
      if (request.kind === 'next') {
        const { channelId, episodeId } = request.selection;
        return this.scheduleService
          .getNextChannelEpisode(channelId, episodeId)
          .pipe(
            map((program) => ({
              status: 'ready' as const,
              episode: program.episode,
              startAt: '0',
              offsetObservedAt: null,
              channelId: program.channelId,
              channelName: program.channelName
            })),
            startWith<VideoPlayerState>({ status: 'loading' }),
            catchError(() => of<VideoPlayerState>({ status: 'error' }))
          );
      }

      const params = request.params;
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
    let targetTime: number | null = null;

    if (startAt !== null) {
      const startSeconds =
        Number(startAt) +
        (offsetObservedAt === null
          ? 0
          : Math.max(0, (Date.now() - offsetObservedAt) / 1000));
      if (Number.isFinite(startSeconds) && startSeconds >= 0) {
        targetTime = Number.isFinite(video.duration)
          ? Math.min(startSeconds, video.duration)
          : startSeconds;
      }
    }

    if (targetTime === null && Number.isFinite(video.duration) && video.duration > 0) {
      targetTime = video.duration * (0.25 + Math.random() * 0.5);
    }

    if (targetTime !== null) video.currentTime = targetTime;

    // Seeking at metadata time can interrupt autoplay, so explicitly resume afterward.
    void video.play().catch(() => undefined);
  }

  playNextChannelEpisode(
    channelId: string | null,
    episodeId: string
  ): void {
    if (channelId) {
      this.nextEpisode$.next({ channelId, episodeId });
    }
  }

}
