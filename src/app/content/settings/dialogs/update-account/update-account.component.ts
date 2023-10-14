import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { InputComponent } from '@app/shared/components/input/input.component';

@Component({
  selector: 'app-update-account',
  standalone: true,
  imports: [CommonModule, InputComponent, ReactiveFormsModule],
  templateUrl: './update-account.component.html',
  styleUrls: ['./update-account.component.scss'],
})
export class UpdateAccountComponent {
  dialogRef = inject(MatDialogRef);
  fb = inject(FormBuilder);
  form = this.fb.group({
    email: [''],
    roles: [[]],
  });

  onConfirm(): void {
    this.dialogRef.close(this.form.getRawValue());
  }

  onDismiss(): void {
    this.dialogRef.close(false);
  }
}
