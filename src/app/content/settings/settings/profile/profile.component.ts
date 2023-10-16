import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { filter } from 'rxjs';
import { Store } from '@ngrx/store';
import { AccountUpdate } from 'src/http-client';

import { UpdateAccountComponent } from '../../dialogs/update-account/update-account.component';
import { settingsActions } from '../../store/actions';

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

  openModal(): void {
    const dialogRef = this.dialog.open(UpdateAccountComponent, {
      width: '500px',
    });

    dialogRef
      .afterClosed()
      .pipe(filter((r) => !!r))
      .subscribe((accountUpdate: AccountUpdate) =>
        this.store.dispatch(settingsActions.changeemail({ accountId: '1', accountUpdate })),
      );
  }
}
