import { inject, ChangeDetectorRef, ViewRef } from '@angular/core';
import { Subject } from 'rxjs';

export class UtilsService {
  /**
   * @description
   * This method is used to unsubscribe from observables when the component is destroyed.
   * Advantage of this method is that you don't have to implements OnDestroy interface and unsubscribe from observables manually.
   * @usage
   * ```ts
   * import { UtilsService } from '@angular/core/services/utils.service';
   *
   * destroy$ = UtilsService.unsubscribe();
   *
   * observable$.pipe(
   *  ...
   *  takeUntil(destroy$)
   * ).subscribe()
   * ```
   * @note
   * This method should be used only in Angular 14 and 15. Angular 16 and above has a built-in solution for this.
   * @see https://angular.io/api/core/rxjs-interop/takeUntilDestroyed
   **/
  static unsubscribe = (): Subject<void> => {
    const unSub$ = new Subject<void>();
    const viewRef = inject(ChangeDetectorRef) as ViewRef;
    void Promise.resolve().then(() => {
      viewRef.onDestroy(() => {
        unSub$.next();
        unSub$.unsubscribe();
      });
    });

    return unSub$;
  };
}
