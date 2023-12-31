import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { combineLatest, filter, take } from 'rxjs';
import { Store } from '@ngrx/store';
import { AccountUpdate } from 'src/http-client';
import { selectDecodedToken } from '@app/content/auth/store/reducers';
import { TranslateModule } from '@ngx-translate/core';

import { UpdateAccountComponent } from '../../dialogs/update-account/update-account.component';
import { settingsActions } from '../../store/actions';
import { ResetPasswordComponent } from '../../dialogs/reset-password/reset-password.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, MatButtonModule, TranslateModule, MatDialogModule],
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
      width: '100vw',
      minHeight: '20vh',
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
      width: '100vw',
      minHeight: '30vh',
    });

    dialogRef
      .afterClosed()
      .pipe(
        filter((r) => !!r),
        take(1),
      )
      .subscribe(({ token, newPassword }) => {
        this.store.dispatch(
          settingsActions.verifypassword({ token: token as string, newPassword: newPassword as string }),
        );
      });
  }
}
