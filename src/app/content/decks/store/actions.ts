import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Deck, DeckCreateRequest, DeckSearchResult } from 'src/http-client';

export const decksActions = createActionGroup({
  source: 'decks',
  events: {
    getDecks: props<{ pageIndex: number; pageSize: number }>(),
    'getDecks Success': props<{ dataSource: DeckSearchResult[]; totalElements: number }>(),
    'getDecks Failure': emptyProps(),
    createDeck: props<{ decksCreateRequest: DeckCreateRequest }>(),
    'createDeck Success': props<{ deck: Deck }>(),
    'createDeck Failure': emptyProps(),
    editDeck: props<{ deckId: string; decksCreateRequest: DeckCreateRequest }>(),
    'editDeck Success': emptyProps(),
    'editDeck Failure': emptyProps(),
    deleteDeck: props<{ deckId: string }>(),
    'deleteDeck Success': emptyProps(),
    'deleteDeck Failure': emptyProps(),
    setActiveDeck: props<{ deck: Deck }>(),
  },
});
