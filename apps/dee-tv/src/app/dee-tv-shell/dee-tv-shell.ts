import { Component, HostListener, inject } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter, map, startWith } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { FeatureSchedule, VideoPlayer } from '@org/feature-schedule';

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
      </section>
    </main>
  `,
  styles: [`
    :host { display: block; min-height: 100vh; }
    .tv-shell { min-height: 100vh; }
    .guide-view { display: none; }
    .guide-mode .guide-view { display: block; }
    .player-view { min-height: 100vh; }
    .guide-mode .player-view {
      position: fixed; z-index: 5; right: 1.5rem; bottom: 1.5rem;
      width: min(28vw, 24rem); aspect-ratio: 16 / 9; min-height: 0;
      overflow: hidden; border: 2px solid #64748b; border-radius: .75rem;
      background: #000; box-shadow: 0 1rem 3rem #000a;
    }
  `]
})
export class DeeTvShell {
  private readonly router = inject(Router);
  readonly isGuide$ = this.router.events.pipe(
    filter((event): event is NavigationEnd => event instanceof NavigationEnd),
    startWith(null),
    map(() => this.router.url.startsWith('/schedule'))
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

  @HostListener('document:fullscreenchange')
  onFullscreenChange(): void {
    if (document.fullscreenElement || this.router.url.startsWith('/schedule')) {
      return;
    }

    void this.router.navigate(['/schedule'], {
      queryParamsHandling: 'preserve'
    });
  }

  @HostListener('document:keydown', ['$event'])
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
}
