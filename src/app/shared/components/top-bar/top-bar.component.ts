import { combineLatest } from 'rxjs';
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { selectCurrentUser } from '@app/content/auth/store/reducers';
import { Store } from '@ngrx/store';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-top-bar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss'],
})
export class TopBarComponent {
  private store = inject(Store);
  data$ = combineLatest({
    currentUser: this.store.select(selectCurrentUser),
  });
}
