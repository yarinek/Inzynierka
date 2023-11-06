import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { DeckCreateRequest, DeckSearchResult } from 'src/http-client';

export const decksActions = createActionGroup({
  source: 'decks',
  events: {
    getDecks: props<{ pageIndex: number; pageSize: number }>(),
    'getDecks Success': props<{ dataSource: DeckSearchResult[] }>(),
    'getDecks Failure': emptyProps(),
    createDeck: props<{ decksCreateRequest: DeckCreateRequest }>(),
    'createDeck Success': emptyProps(),
    'createDeck Failure': emptyProps(),
    setActiveDeck: props<{ deckId: string }>(),
  },
});
