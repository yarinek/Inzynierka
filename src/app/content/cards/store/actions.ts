import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Card, CardCreateRequest, CardReviewAnswer } from 'src/http-client';

export const cardsActions = createActionGroup({
  source: 'cards',
  events: {
    getCards: props<{ pageIndex: number; pageSize: number }>(),
    'getCards Success': props<{ dataSource: Card[]; totalElements: number }>(),
    'getCards Failure': emptyProps(),
    createCard: props<{ cardCreateRequest: CardCreateRequest }>(),
    'createCard Success': props<{ card: Card }>(),
    'createCard Failure': emptyProps(),
    editCard: props<{ cardId: string; cardUpdateRequest: CardCreateRequest }>(),
    'editCard Success': emptyProps(),
    'editCard Failure': emptyProps(),
    deleteCard: props<{ cardId: string }>(),
    'deleteCard Success': emptyProps(),
    'deleteCard Failure': emptyProps(),
    getCard: props<{ cardId: string }>(),
    'getCard Success': props<{ card: Card }>(),
    'getCard Failure': emptyProps(),
    submitAnswer: props<{ answer: CardReviewAnswer }>(),
    'submitAnswer Success': props<{ card: Card }>(),
    'submitAnswer Failure': emptyProps(),
    startActivity: emptyProps(),
    'startActivity Success': props<{ card: Card }>(),
    'startActivity Failure': emptyProps(),

    // utils
    redirectIfNull: emptyProps(),
  },
});
