import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

/**
 * Available toastr type
 */
export type ToastrType = 'info' | 'success' | 'error' | 'warn';

/**
 * service for displaying a toastr
 */
@Injectable()
export class ToastrService {
  constructor(private toastService: MatSnackBar) {}

  /**
   * Show info toastr
   */
  info(message: string, title?: string): void {
    this.show('info', message, title);
  }

  /**
   * Show success toastr
   */
  success(message: string, title?: string): void {
    this.show('success', message, title);
  }

  /**
   * Show error toastr
   */
  error(message: string, title?: string): void {
    this.show('error', message, title);
  }

  /**
   * Show warning toastr
   */
  warning(message: string, title?: string): void {
    this.show('warn', message, title);
  }

  /**
   *
   * @param type toastr type
   * @param message message to be displayed in the toastr - it can be a string or ToastrMessage
   * @param title title to be displayed in the toastr
   * @param override configuration of the toastr display
   */
  private show(type: ToastrType, message: string, title = 'Close'): void {
    this.toastService.open(message, title, {
      panelClass: [`toast-${type}`],
      horizontalPosition: 'right',
      verticalPosition: 'top',
    });
  }
}
