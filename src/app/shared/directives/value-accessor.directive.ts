import { Subject } from 'rxjs';
import { Directive, forwardRef, OnDestroy } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

/**
 * @description
 * This directive is used to create a custom form control.
 * @usage
 * ```ts
 * import { ValueAccessorDirective } from '@angular/directives/value-accessor.directive';
 *
 * Component({
 *  selector: 'app-input',
 *  standalone: true,
 *  hostDirectives: [ValueAccessorDirective],
 * })
 * export class InputComponent implements OnInit {
 *    public valueAccessor = inject(ValueAccessorDirective<string | number>);
 *    value!: string | number;
 *
 *    ngOnInit(): void {
 *     this.valueAccessor.value.subscribe((v) => (this.value = v));
 *    }
 *
 *  //method is used to update the value of the custom form control.
 *   public updateValue(value: string): void {
 *    this.valueAccessor.valueChange(value);
 *    this.valueAccessor.touchedChange(true);
 *   }
 *```
 * @example
 * ```html
 *  <input (input)="updateValue($event.target.value)" ... />
 * ```
 */
@Directive({
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ValueAccessorDirective),
      multi: true,
    },
  ],
})
export class ValueAccessorDirective<T> implements ControlValueAccessor, OnDestroy {
  private onChange!: (value: T) => void;
  private onTouched!: (value?: boolean) => void;
  private valueSubject = new Subject<T>();
  private disabledSubject = new Subject<boolean>();
  readonly value = this.valueSubject.asObservable();
  readonly disabled = this.disabledSubject.asObservable();

  valueChange(v: T): void {
    this.onChange(v);
  }

  touchedChange(v: boolean): void {
    this.onTouched(v);
  }

  writeValue(obj: T): void {
    this.valueSubject.next(obj);
  }

  updateValue(value: T): void {
    this.valueSubject.next(value);
  }

  registerOnChange(fn: (value: T) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: (value?: boolean) => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabledSubject.next(isDisabled);
  }

  ngOnDestroy(): void {
    this.valueSubject.complete();
    this.disabledSubject.complete();
  }
}
