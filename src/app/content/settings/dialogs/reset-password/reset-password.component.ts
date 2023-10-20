import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { InputComponent } from '@app/shared/components/input/input.component';
import { MatButtonModule } from '@angular/material/button';
import { firstValueFrom } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectDecodedToken } from '@app/content/auth/store/reducers';

import { settingsActions } from '../../store/actions';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, InputComponent, ReactiveFormsModule, MatButtonModule],
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

  async onConfirm(): Promise<void> {
    const decodedToken = await firstValueFrom(this.store.select(selectDecodedToken));
    this.dialogRef.close({ ...this.form.getRawValue(), email: decodedToken?.email as string });
  }

  onDismiss(): void {
    this.dialogRef.close(false);
  }

  async getVerificationToken(): Promise<void> {
    const decodedToken = await firstValueFrom(this.store.select(selectDecodedToken));
    const data = { email: decodedToken?.email as string };
    this.store.dispatch(settingsActions.resetpassword({ data }));
  }
}
