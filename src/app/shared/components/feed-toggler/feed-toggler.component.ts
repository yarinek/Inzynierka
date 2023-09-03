import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { selectCurrentUser } from '@app/content/auth/store/reducers';

@Component({
  selector: 'app-feed-toggler',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './feed-toggler.component.html',
  styleUrls: ['./feed-toggler.component.scss'],
})
export class FeedTogglerComponent {
  @Input() tagName?: string;
  private store = inject(Store);

  currentUser$ = this.store.select(selectCurrentUser);
}
