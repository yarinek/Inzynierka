import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputComponent } from '@app/shared/components/input/input.component';
import { MatButtonModule } from '@angular/material/button';
import { SelectComponent } from '@app/shared/components/select/select.component';
import { SelectOptionInterface } from '@app/shared/components/select/select.types';

@Component({
  selector: 'app-create-deck',
  standalone: true,
  imports: [CommonModule, InputComponent, ReactiveFormsModule, MatButtonModule, SelectComponent],
  templateUrl: './create-deck.component.html',
  styleUrls: ['./create-deck.component.scss'],
})
export class CreateDeckComponent implements OnInit {
  dialogRef = inject(MatDialogRef);
  store = inject(Store);
  fb = inject(FormBuilder);

  dialogData: { name: string; language: string } = inject(MAT_DIALOG_DATA);

  languageOptions: SelectOptionInterface[] = [{ value: 'en', label: 'English' }];

  form = this.fb.group({
    name: ['', Validators.required],
    language: ['', Validators.required],
    sharedDeckId: [''],
  });

  get isEdit(): boolean {
    return !!this.dialogData;
  }

  ngOnInit(): void {
    this.form.patchValue({ ...this.dialogData });
  }

  onConfirm(): void {
    const { name, language, sharedDeckId } = this.form.getRawValue();
    this.dialogRef.close({ name, language, ...(sharedDeckId ? { sharedDeckId } : {}) });
  }

  onDismiss(): void {
    this.dialogRef.close(false);
  }
}
