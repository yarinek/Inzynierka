import { TranslateModule } from '@ngx-translate/core';
import { combineLatest } from 'rxjs';
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { CardReviewAnswer } from 'src/http-client';

import { selectPreviewCard } from '../store/reducers';
import { cardsActions } from '../store/actions';
import { CarouselComponent } from './carousel/carousel.component';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule, MatButtonModule, TranslateModule, CarouselComponent],
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent implements OnInit {
  router = inject(Router);
  store = inject(Store);

  data$ = combineLatest({
    card: this.store.select(selectPreviewCard),
  });

  get isPreview(): boolean {
    return this.router.url.includes('preview');
  }

  ngOnInit(): void {
    this.store.dispatch(cardsActions.redirectifnull());
  }

  answer(answer: CardReviewAnswer): void {
    this.store.dispatch(
      cardsActions.submitanswer({
        answer,
      }),
    );
  }

  backToDeck(): void {
    void this.router.navigate(['/cards']);
  }
}
