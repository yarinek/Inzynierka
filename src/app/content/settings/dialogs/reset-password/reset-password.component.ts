import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { InputComponent } from '@app/shared/components/input/input.component';
import { MatButtonModule } from '@angular/material/button';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';

import { settingsActions } from '../../store/actions';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, InputComponent, ReactiveFormsModule, MatButtonModule, TranslateModule],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent {
  dialogRef = inject(MatDialogRef);
  store = inject(Store);
  fb = inject(FormBuilder);

  form = this.fb.group({
    token: [''],
    newPassword: [''],
  });

  onConfirm(): void {
    this.dialogRef.close({ ...this.form.getRawValue() });
  }

  onDismiss(): void {
    this.dialogRef.close(false);
  }

  getVerificationToken(): void {
    this.store.dispatch(settingsActions.resetpassword());
  }
}
