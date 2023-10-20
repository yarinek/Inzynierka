import { combineLatest } from 'rxjs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { Store } from '@ngrx/store';
import { authActions } from '@app/content/auth/store/actions';
import { selectToken } from '@app/content/auth/store/reducers';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule, MatIconModule, RouterLink, MatIconModule, MatButtonModule, MatToolbarModule],
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss'],
})
export class TopbarComponent {
  private store = inject(Store);

  data$ = combineLatest({
    token$: this.store.select(selectToken),
  });

  logout(): void {
    this.store.dispatch(authActions.logout());
  }
}
