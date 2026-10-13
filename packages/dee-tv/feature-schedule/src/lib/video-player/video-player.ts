import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { catchError, map, of, startWith, switchMap } from 'rxjs';
import { Episode } from '../+state/schedule.models';
import { ScheduleService } from '../services/schedule.service';

type VideoPlayerState =
  | { status: 'loading' }
  | { status: 'missing-id' }
  | { status: 'not-found' }
  | { status: 'error' }
  | { status: 'ready'; episode: Episode; startAt: string | null };

@Component({
  selector: 'dee-tv-video-player',
  imports: [AsyncPipe, RouterLink],
  templateUrl: './video-player.html',
  styleUrl: './video-player.css'
})
export class VideoPlayer {
  private readonly route = inject(ActivatedRoute);
  private readonly scheduleService = inject(ScheduleService);

  readonly state$ = this.route.queryParamMap.pipe(
    switchMap((params) => {
      const videoId = params.get('video');
      const startAt = params.get('start');

      if (!videoId) {
        return of<VideoPlayerState>({ status: 'missing-id' });
      }

      return this.scheduleService.getSchedule().pipe(
        map((episodes) => {
          const episode = episodes.find((item) => item.id === videoId);
          return episode
            ? ({ status: 'ready', episode, startAt } as const)
            : ({ status: 'not-found' } as const);
        }),
        startWith<VideoPlayerState>({ status: 'loading' }),
        catchError(() => of<VideoPlayerState>({ status: 'error' }))
      );
    })
  );

  seekToStart(video: HTMLVideoElement, startAt: string | null): void {
    if (startAt !== null) {
      const startSeconds = Number(startAt);
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
}
