import { TranslateModule } from '@ngx-translate/core';
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { InputComponent } from '@app/shared/components/input/input.component';
import { MatButtonModule } from '@angular/material/button';
import { Store } from '@ngrx/store';
import { firstValueFrom } from 'rxjs';
import { selectDecodedToken } from '@app/content/auth/store/reducers';

@Component({
  selector: 'app-update-account',
  standalone: true,
  imports: [CommonModule, InputComponent, ReactiveFormsModule, MatButtonModule, TranslateModule],
  templateUrl: './update-account.component.html',
  styleUrls: ['./update-account.component.scss'],
})
export class UpdateAccountComponent {
  dialogRef = inject(MatDialogRef);
  fb = inject(FormBuilder);
  store = inject(Store);

  form = this.fb.group({
    email: [''],
    roles: [[]],
  });

  async onConfirm(): Promise<void> {
    const decodedToken = await firstValueFrom(this.store.select(selectDecodedToken));
    const { roles, ...rest } = this.form.getRawValue();
    if (decodedToken?.roles.includes('ADMIN')) {
      this.dialogRef.close({ ...rest, roles, accountId: decodedToken?.userId });
      return;
    }
    this.dialogRef.close({ ...rest, accountId: decodedToken?.userId as string });
  }

  onDismiss(): void {
    this.dialogRef.close(false);
  }
}
