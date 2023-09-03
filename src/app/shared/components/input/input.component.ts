import { Component, Input, inject, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ValueAccessorDirective } from '@app/shared/directives/value-accessor.directive';
import { NgControl, ReactiveFormsModule, UntypedFormControl } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ErrorService } from '@app/core/services/error.service';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule, MatInputModule, MatFormFieldModule, ReactiveFormsModule],
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  hostDirectives: [ValueAccessorDirective],
})
export class InputComponent implements OnInit, AfterViewInit {
  @Input() placeholder = '';
  @Input() id = '';
  @Input() type = 'text';
  @Input() ariaLabel = '';

  public valueAccessor = inject(ValueAccessorDirective<string | number>);
  protected readonly errorService = inject(ErrorService);
  private readonly ngControl = inject(NgControl);
  private readonly cdr = inject(ChangeDetectorRef);

  value!: string | number;
  inputControl = new UntypedFormControl();

  ngOnInit(): void {
    this.valueAccessor.value.subscribe((v) => (this.value = v));
  }

  ngAfterViewInit(): void {
    this.inputControl = this.ngControl.control as UntypedFormControl;
    this.cdr.detectChanges();
  }

  public updateValue(value: string): void {
    this.valueAccessor.valueChange(value);
    this.valueAccessor.touchedChange(true);
  }
}
