import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  static showLoader(): void {
    const event = new CustomEvent('loader', { detail: true });
    window.dispatchEvent(event);
  }

  static hideLoader(): void {
    const event = new CustomEvent('loader', { detail: false });
    window.dispatchEvent(event);
  }
}
