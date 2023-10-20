import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { combineLatest, filter, take } from 'rxjs';
import { Store } from '@ngrx/store';
import { AccountUpdate, PasswordResetRequest } from 'src/http-client';
import { selectDecodedToken } from '@app/content/auth/store/reducers';

import { UpdateAccountComponent } from '../../dialogs/update-account/update-account.component';
import { settingsActions } from '../../store/actions';
import { ResetPasswordComponent } from '../../dialogs/reset-password/reset-password.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent {
  dialog = inject(MatDialog);
  store = inject(Store);

  data$ = combineLatest({
    decodedToken$: this.store.select(selectDecodedToken),
  });

  changeEmailModal(): void {
    const dialogRef = this.dialog.open(UpdateAccountComponent, {
      width: '500px',
    });

    dialogRef
      .afterClosed()
      .pipe(filter((r) => !!r))
      .subscribe(({ accountId, ...rest }: AccountUpdate & { accountId: string }) =>
        this.store.dispatch(settingsActions.changeemail({ accountId, accountUpdate: rest })),
      );
  }

  resetPassword(): void {
    const dialogRef = this.dialog.open(ResetPasswordComponent, {
      width: '500px',
    });

    dialogRef
      .afterClosed()
      .pipe(
        filter((r) => !!r),
        take(1),
      )
      .subscribe((request: PasswordResetRequest) => {
        this.store.dispatch(settingsActions.verifypassword({ request }));
      });
  }
}
