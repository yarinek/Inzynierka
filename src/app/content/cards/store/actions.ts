import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Card, CardCreateRequest, CardReviewAnswer } from 'src/http-client';

export const cardsActions = createActionGroup({
  source: 'cards',
  events: {
    getCards: props<{ deckId: string; pageIndex: number; pageSize: number }>(),
    'getCards Success': props<{ dataSource: Card[]; totalElements: number }>(),
    'getCards Failure': emptyProps(),
    createCard: props<{ deckId: string; decksCreateRequest: CardCreateRequest }>(),
    'createCard Success': props<{ card: Card }>(),
    'createCard Failure': emptyProps(),
    deleteCard: props<{ cardId: string }>(),
    'deleteCard Success': emptyProps(),
    'deleteCard Failure': emptyProps(),
    getCard: props<{ deckId: string; cardId: string }>(),
    'getCard Success': props<{ card: Card }>(),
    'getCard Failure': emptyProps(),
    submitAnswer: props<{ deckId: string; cardId: string; answer: CardReviewAnswer }>(),
    'submitAnswer Success': props<{ card: Card }>(),
    'submitAnswer Failure': emptyProps(),
    startActivity: props<{ deckId: string }>(),
    'startActivity Success': props<{ card: Card }>(),
    'startActivity Failure': emptyProps(),

    // utils
    redirectIfNull: emptyProps(),
  },
});
