import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Card, CardContentElement, CardContentElementType } from 'src/http-client';

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss'],
  animations: [
    trigger('carouselAnimation', [
      transition('void => *', [style({ opacity: 0 }), animate('300ms', style({ opacity: 1 }))]),
      transition('* => void', [animate('300ms', style({ opacity: 0 }))]),
    ]),
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
export class CarouselComponent implements OnChanges {
  @Input() card: Card | undefined;
  @Input() flip: 'inactive' | 'active' = 'inactive';

  currentSlide = 0;

  contentType = CardContentElementType;

  get slidesFront(): CardContentElement[] {
    return this.card?.front as CardContentElement[];
  }

  get slidesBack(): CardContentElement[] {
    return this.card?.back as CardContentElement[];
  }

  get slides(): CardContentElement[] {
    return this.flip == 'inactive' ? this.slidesFront : this.slidesBack;
  }

  ngOnChanges(): void {
    this.currentSlide = 0;
    this.flip = 'inactive';
  }

  toggleFlip(): void {
    this.flip = this.flip == 'inactive' ? 'active' : 'inactive';
    this.currentSlide = 0;
  }

  onPreviousClick(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    const previous = this.currentSlide - 1;
    this.currentSlide = previous < 0 ? this.slides.length - 1 : previous;
  }

  onNextClick(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    const next = this.currentSlide + 1;
    this.currentSlide = next === this.slides.length ? 0 : next;
  }
}
