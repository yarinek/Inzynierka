import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { filter, Observable, switchMap } from 'rxjs';

import { ConfirmationDialogComponent } from './confirmation-dialog.component';

@Injectable({
  providedIn: 'root',
})
export class ConfirmationDialogService {
  dialog = inject(MatDialog);

  /**
   * @description
   * This method is used to show confirmation dialog before executing some action.
   * @usage
   * ```ts
   * import { ConfirmationDialogService } from '@angular/shared/components/confirmation-dialog/confirmation-dialog.service';
   *
   * private confirmationDialogService = inject(ConfirmationDialogService);
   *
   * this.confirmationDialogService.withConfirmation(this.exampleService.deleteExample()).subscribe()
   * ```
   *
   * @param source - Observable that will be executed after confirmation
   * @returns
   */
  withConfirmation<T>(source: Observable<T>): Observable<T> {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent);

    return dialogRef.afterClosed().pipe(
      filter((r) => !!r),
      switchMap(() => source),
    );
  }
}
