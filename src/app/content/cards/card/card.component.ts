import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { CardReviewAnswer } from 'src/http-client';
import { MatButtonModule } from '@angular/material/button';

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
  flip = 'inactive';

  toggleFlip(): void {
    this.flip = this.flip == 'inactive' ? 'active' : 'inactive';
  }

  answer(answer: CardReviewAnswer): void {
    console.log(answer);
  }
}
