import {
  Component,
  Input,
  inject,
  ChangeDetectorRef,
  OnInit,
  AfterViewInit,
  Output,
  EventEmitter,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ValueAccessorDirective } from '@app/shared/directives/value-accessor.directive';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { NgControl, ReactiveFormsModule, UntypedFormControl } from '@angular/forms';
import { ErrorService } from '@app/core/services/error.service';
import { MatIconModule } from '@angular/material/icon';

import { SelectOptionInterface } from './select.types';

@Component({
  selector: 'app-select',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatSelectModule, MatOptionModule, ReactiveFormsModule, MatIconModule],
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  hostDirectives: [ValueAccessorDirective],
})
export class SelectComponent implements OnInit, AfterViewInit {
  @Input() placeholder = '';
  @Input() id = '';
  @Input() options: Array<SelectOptionInterface> = [];
  @Input() multi = false;
  @Input() baseKey = '';
  @Input() ariaLabel = '';
  @Input() uncheck = true;
  @Input() sort = true;
  @Output() selectedOption = new EventEmitter<string>();

  public valueAccessor = inject(ValueAccessorDirective<SelectOptionInterface>);
  protected readonly errorService = inject(ErrorService);
  private readonly ngControl = inject(NgControl);
  private readonly cdr = inject(ChangeDetectorRef);

  value!: SelectOptionInterface;
  selectControl = new UntypedFormControl();

  ngOnInit(): void {
    this.valueAccessor.value.subscribe((v) => (this.value = v));
  }

  ngAfterViewInit(): void {
    this.selectControl = this.ngControl.control as UntypedFormControl;
    this.sortOptions();
    this.cdr.detectChanges();
  }

  public selectValue(value: MatSelectChange): void {
    this.selectedOption.emit(value.value as string);
  }

  public updateValue(value: { key: string; value: string; attribute?: string }): void {
    this.valueAccessor.valueChange(value);
    this.valueAccessor.touchedChange(true);
  }

  private sortOptions(): void {
    if (this.options) {
      this.options.sort((a: SelectOptionInterface, b: SelectOptionInterface) =>
        a.value.localeCompare(b.value, undefined, { numeric: true, sensitivity: 'base' }),
      );
    }
  }
}
