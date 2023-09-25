export class LoaderService {
  /**
   * Show global loader defined in src/app/shared/components/loader/loader.component.ts
   */
  static showLoader(): void {
    const event = new CustomEvent<boolean>('loader', { detail: true });
    window.dispatchEvent(event);
  }

  /**
   * Hide global loader defined in src/app/shared/components/loader/loader.component.ts
   */
  static hideLoader(): void {
    const event = new CustomEvent<boolean>('loader', { detail: false });
    window.dispatchEvent(event);
  }
}
