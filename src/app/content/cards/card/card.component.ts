import { combineLatest, map } from 'rxjs';
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { CardReviewAnswer } from 'src/http-client';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { selectPreviewCard } from '../store/reducers';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
  animations: [
    trigger('flipState', [
      state(
        'active',
        style({
          transform: 'rotateY(179deg)',
        }),
      ),
      state(
        'inactive',
        style({
          transform: 'rotateY(0)',
        }),
      ),
      transition('active => inactive', animate('500ms ease-out')),
      transition('inactive => active', animate('500ms ease-in')),
    ]),
  ],
})
export class CardComponent {
  router = inject(Router);
  store = inject(Store);
  flip = 'inactive';

  data$ = combineLatest({
    card: this.store
      .select(selectPreviewCard)
      .pipe(map((card) => ({ ...card, front: card?.front![0], back: card?.back![0] }))),
  });

  get isPreview(): boolean {
    return this.router.url.includes('preview');
  }

  toggleFlip(): void {
    this.flip = this.flip == 'inactive' ? 'active' : 'inactive';
  }

  answer(answer: CardReviewAnswer): void {
    console.log(answer);
  }

  backToDeck(): void {
    void this.router.navigate(['/cards']);
  }
}
