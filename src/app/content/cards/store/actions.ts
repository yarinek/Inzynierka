import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Card, CardCreateRequest } from 'src/http-client';

export const cardsActions = createActionGroup({
  source: 'cards',
  events: {
    getCards: props<{ deckId: string; pageIndex: number; pageSize: number }>(),
    'getCards Success': props<{ dataSource: Card[] }>(),
    'getCards Failure': emptyProps(),
    createCard: props<{ decksCreateRequest: CardCreateRequest }>(),
    'createCard Success': emptyProps(),
    'createCard Failure': emptyProps(),
  },
});
