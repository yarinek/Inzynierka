import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputComponent } from '@app/shared/components/input/input.component';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-create-deck',
  standalone: true,
  imports: [CommonModule, InputComponent, ReactiveFormsModule, MatButtonModule],
  templateUrl: './create-deck.component.html',
  styleUrls: ['./create-deck.component.scss'],
})
export class CreateDeckComponent {
  dialogRef = inject(MatDialogRef);
  store = inject(Store);
  fb = inject(FormBuilder);

  form = this.fb.group({
    name: ['', Validators.required],
    language: ['', Validators.required],
    sharedDeckId: [''],
  });

  onConfirm(): void {
    const { name, language, sharedDeckId } = this.form.getRawValue();
    this.dialogRef.close({ name, language, ...(sharedDeckId ? { sharedDeckId } : {}) });
  }

  onDismiss(): void {
    this.dialogRef.close(false);
  }
}
