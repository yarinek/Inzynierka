import { Injectable, inject, ChangeDetectorRef, ViewRef } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
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

  range(start: number, end: number): number[] {
    return [...Array(end - start).keys()].map((el) => el + start);
  }
}
