import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  from,
  fromEvent,
  Observable,
  Subscription,
} from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';

export interface BeforeInstallPromptEvent extends Event {
  readonly platforms: Array<string>;
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

@Injectable({
  providedIn: 'root',
})
export class InstallPwaService {
  appInstalledEvent: Observable<Event> | undefined;
  beforeInstallEvent: Observable<Event> | undefined;
  subscriptions: Subscription[] = [];
  promptEvent: any;

  private $isInstalled: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    true
  );

  get isInstalled() {
    return this.$isInstalled.asObservable();
  }

  deferredPrompt$ = new BehaviorSubject<BeforeInstallPromptEvent | null>(null);

  showInstallPromotion$ = this.deferredPrompt$.pipe(map((prompt) => !!prompt));

  interceptDefaultInstall() {
    fromEvent<BeforeInstallPromptEvent>(
      window,
      'beforeinstallprompt'
    ).subscribe({
      next: (event) => {
        event.preventDefault();

        this.deferredPrompt$.next(event);
      },
    });

    fromEvent(window, 'appinstalled').subscribe({
      next: () => {
        this.deferredPrompt$.next(null);
      },
    });

    fromEvent(
      window.matchMedia('(display-mode: standalone)'),
      'change'
    ).subscribe({
      next: (evt) => {
        let displayMode = 'browser';
        if ((evt as any).matches) {
          displayMode = 'standalone';
        }
      },
    });
  }

  installPromotion() {
    const deferredPrompt = this.deferredPrompt$.getValue();
    if (!deferredPrompt) {
      return;
    }
    from(deferredPrompt?.prompt())
      .pipe(
        switchMap(() => from(deferredPrompt.userChoice)),
        take(1)
      )
      .subscribe({
        next: () => {
          this.deferredPrompt$.next(null);
        },
      });
  }

  getPWADisplayMode() {
    const isStandalone = window.matchMedia(
      '(display-mode: standalone)'
    ).matches;
    if (document.referrer.startsWith('android-app://')) {
      return 'twa';
    } else if ((navigator as any).standalone || isStandalone) {
      return 'standalone';
    }
    return 'browser';
  }

  handleAppIsInstallChanges(): void {
    this.appInstalledEvent = fromEvent(window, 'appinstalled');
    this.beforeInstallEvent = fromEvent(window, 'beforeinstallprompt');

    this.subscriptions.push(
      this.appInstalledEvent.subscribe((e) => {
        this.$isInstalled.next(true);
      })
    );

    this.subscriptions.push(
      this.beforeInstallEvent.subscribe((e) => {
        this.promptEvent = e;
        this.$isInstalled.next(false);
      })
    );
  }
}
