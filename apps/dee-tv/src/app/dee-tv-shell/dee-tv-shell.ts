import { Component, HostListener, inject } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import {
  catchError,
  filter,
  map,
  of,
  shareReplay,
  startWith,
  switchMap,
  take
} from 'rxjs';
import { AsyncPipe } from '@angular/common';
import {
  FeatureSchedule,
  ScheduleService,
  VideoPlayer
} from '@org/feature-schedule';

@Component({
  selector: 'dee-tv-shell',
  imports: [AsyncPipe, FeatureSchedule, VideoPlayer],
  template: `
    @let isGuide = isGuide$ | async;
    <main class="tv-shell" [class.guide-mode]="isGuide === true">
      <section class="guide-view" [attr.aria-hidden]="isGuide !== true">
        <dee-tv-feature-schedule />
      </section>
      <section class="player-view">
        <dee-tv-video-player [guideMode]="isGuide === true" />
        @if (isGuide !== true) {
          @if (channelNumber$ | async; as channelNumber) {
            <div class="channel-number" aria-label="Channel {{ channelNumber }}">
              {{ channelNumber }}
            </div>
          }
        }
      </section>
    </main>
  `,
  styles: [`
    :host { display: block; min-height: 100vh; }
    .tv-shell { min-height: 100vh; }
    .guide-view { display: none; }
    .guide-mode .guide-view { display: block; }
    .player-view { position: relative; min-height: 100vh; }
    .channel-number {
      position: absolute; z-index: 10; top: 1.5rem; left: 1.5rem;
      padding: .5rem .85rem; border-radius: .5rem;
      color: #fff; background: rgb(18 18 18 / 72%);
      font-size: clamp(1rem, 2.5vw, 1.75rem); font-weight: 700;
      pointer-events: none;
    }
    .guide-mode .player-view {
      position: fixed; z-index: 5; right: 1.5rem; bottom: 1.5rem;
      width: min(28vw, 24rem); aspect-ratio: 16 / 9; min-height: 0;
      overflow: hidden; border: 2px solid #64748b; border-radius: .75rem;
      background: #000; box-shadow: 0 1rem 3rem #000a; cursor: pointer;
    }
  `]
})
export class DeeTvShell {
  private readonly router = inject(Router);
  private readonly scheduleService = inject(ScheduleService);
  readonly isGuide$ = this.router.events.pipe(
    filter((event): event is NavigationEnd => event instanceof NavigationEnd),
    startWith(null),
    map(() => this.router.url.startsWith('/schedule'))
  );
  readonly channelNumber$ = this.router.events.pipe(
    filter((event): event is NavigationEnd => event instanceof NavigationEnd),
    startWith(null),
    map(() => {
      const channel = this.router.parseUrl(this.router.url).queryParams[
        'channel'
      ];
      return typeof channel === 'string' ? channel : channel?.[0] ?? null;
    }),
    switchMap((channelId) => {
      if (!channelId) return of(null);

      return this.scheduleService.getChannels().pipe(
        map((channels) => {
          const index = channels.findIndex((item) => item.id === channelId);
          return index < 0 ? null : index + 1;
        }),
        catchError(() => of(null))
      );
    }),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  @HostListener('document:click', ['$event'])
  onTuneClick(event: MouseEvent): void {
    if (!(event.target instanceof Element)) return;
    if (!event.target.closest('.guide-view a[href]')) return;

    const playerView = document.querySelector<HTMLElement>('.player-view');
    if (!playerView || document.fullscreenElement) return;

    // The channel selection click is a user gesture, so browsers can grant fullscreen here.
    void playerView.requestFullscreen().catch(() => undefined);
  }

  @HostListener('document:click', ['$event'])
  onMiniPlayerClick(event: MouseEvent): void {
    if (!(event.target instanceof Element)) return;
    if (!event.target.closest('.guide-mode .player-view')) return;

    const playerView = document.querySelector<HTMLElement>('.player-view');
    if (!playerView) return;

    // Keep the click's user activation available for the fullscreen request.
    if (!document.fullscreenElement) {
      void playerView.requestFullscreen().catch(() => undefined);
    }
    void this.router.navigate(['/watch'], {
      queryParamsHandling: 'preserve'
    });
  }

  @HostListener('document:fullscreenchange')
  onFullscreenChange(): void {
    if (document.fullscreenElement || this.router.url.startsWith('/schedule')) {
      return;
    }

    void this.router.navigate(['/schedule'], {
      queryParamsHandling: 'preserve'
    });
  }

  @HostListener('window:keydown', ['$event'])
  onRemoteKey(event: KeyboardEvent): void {
    if (['Escape', 'Backspace', 'BrowserBack', 'GoBack'].includes(event.key)) {
      event.preventDefault();
      if (document.fullscreenElement) {
        void document.exitFullscreen();
        return;
      }
      void this.router.navigate(['/schedule'], {
        queryParamsHandling: 'preserve'
      });
      return;
    }

    if (
      (document.fullscreenElement || this.router.url.startsWith('/watch')) &&
      (event.key === 'ArrowUp' || event.key === 'ArrowDown')
    ) {
      event.preventDefault();
      this.changeChannel(event.key === 'ArrowUp' ? 1 : -1);
      return;
    }

    if (!this.router.url.startsWith('/schedule')) return;
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
    const links = Array.from(
      document.querySelectorAll<HTMLElement>('.guide-view a[href]')
    );
    if (!links.length) return;

    const currentIndex = links.indexOf(document.activeElement as HTMLElement);
    const direction = event.key === 'ArrowDown' ? 1 : -1;
    const nextIndex = currentIndex < 0
      ? 0
      : (currentIndex + direction + links.length) % links.length;
    event.preventDefault();
    links[nextIndex].focus();
  }

  private changeChannel(direction: 1 | -1): void {
    this.scheduleService
      .getChannels()
      .pipe(take(1))
      .subscribe({
        next: (channels) => {
          if (channels.length === 0) return;

          const current = this.router.parseUrl(this.router.url).queryParams[
            'channel'
          ];
          const currentChannelId =
            typeof current === 'string' ? current : current?.[0];
          const currentIndex = channels.findIndex(
            (channel) => channel.id === currentChannelId
          );
          const nextIndex =
            currentIndex < 0
              ? direction === 1
                ? 0
                : channels.length - 1
              : (currentIndex + direction + channels.length) % channels.length;

          void this.router.navigate(['/watch'], {
            queryParams: { channel: channels[nextIndex].id },
            queryParamsHandling: 'merge',
            replaceUrl: true
          });
        },
        error: (error: unknown) => {
          console.error('Unable to change Dee TV channel.', error);
        }
      });
  }
}
