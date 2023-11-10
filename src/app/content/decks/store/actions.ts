import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { DeckCreateRequest, DeckSearchResult } from 'src/http-client';

export const decksActions = createActionGroup({
  source: 'decks',
  events: {
    getDecks: props<{ pageIndex: number; pageSize: number }>(),
    'getDecks Success': props<{ dataSource: DeckSearchResult[]; totalElements: number }>(),
    'getDecks Failure': emptyProps(),
    createDeck: props<{ decksCreateRequest: DeckCreateRequest }>(),
    'createDeck Success': props<{ deckId: string }>(),
    'createDeck Failure': emptyProps(),
    deleteDeck: props<{ deckId: string }>(),
    'deleteDeck Success': emptyProps(),
    'deleteDeck Failure': emptyProps(),
    setActiveDeck: props<{ deckId: string }>(),
  },
});
