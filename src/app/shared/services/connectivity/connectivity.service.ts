import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ConnectivityService {
  private isConnected = new BehaviorSubject<boolean>(!!window.navigator.onLine);
  isConnected$ = this.isConnected.asObservable();

  constructor() {
    this.initConnectivityMonitoring();
  }

  private initConnectivityMonitoring() {
    window.addEventListener('online', () => {
      this.isConnected.next(!!window.navigator.onLine);
    });
    window.addEventListener('offline', () => {
      this.isConnected.next(!!window.navigator.onLine);
    });
  }
}
