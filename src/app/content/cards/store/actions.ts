import { createActionGroup, emptyProps, props } from '@ngrx/store';
import {
  Card,
  CardCreateRequest,
  CardReviewAnswer,
  CardUpdateRequest,
  ScheduledCardReviews,
  SharedCard,
} from 'src/http-client';

export const cardsActions = createActionGroup({
  source: 'cards',
  events: {
    getCards: props<{ pageIndex: number; pageSize: number }>(),
    'getCards Success': props<{ dataSource: Card[]; totalElements: number }>(),
    'getCards Failure': emptyProps(),
    createCard: props<{ cardCreateRequest: CardCreateRequest }>(),
    'createCard Success': props<{ card: Card }>(),
    'createCard Failure': emptyProps(),
    editCard: props<{ cardId: string; cardUpdateRequest: CardUpdateRequest }>(),
    'editCard Success': emptyProps(),
    'editCard Failure': emptyProps(),
    deleteCard: props<{ cardId: string }>(),
    'deleteCard Success': emptyProps(),
    'deleteCard Failure': emptyProps(),
    getCard: props<{ cardId: string }>(),
    'getCard Success': props<{ card: Card }>(),
    'getCard Failure': emptyProps(),
    submitAnswer: props<{ answer: CardReviewAnswer }>(),
    'submitAnswer Success': props<{ scheduledCardReviews: ScheduledCardReviews }>(),
    'submitAnswer Failure': emptyProps(),
    startActivity: emptyProps(),
    'startActivity Success': props<{ scheduledCardReviews: ScheduledCardReviews }>(),
    'startActivity Failure': emptyProps(),

    // shared cards
    getSharedCards: props<{ pageIndex: number; pageSize: number }>(),
    'getSharedCards Success': props<{ dataSource: SharedCard[]; totalElements: number }>(),
    'getSharedCards Failure': emptyProps(),
    // utils
    redirectIfNull: emptyProps(),
  },
});
