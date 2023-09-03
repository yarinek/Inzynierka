import { Injectable } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class ErrorService {
  private errorMessages: { [key: string]: (c: UntypedFormControl) => string } = {
    required: () => `Pole wymagane.`,
  };

  public mapErrors(control: UntypedFormControl | null): string[] {
    return Object.keys(control?.errors || {}).map((key) => this.errorMessages[key](control as UntypedFormControl));
  }
}
