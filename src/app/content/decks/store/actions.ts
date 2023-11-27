import { createActionGroup, emptyProps, props } from '@ngrx/store';
import {
  Deck,
  DeckCreateRequest,
  DeckSearchResult,
  SharedDeck,
  SharedDeckCreateRequest,
  SharedDeckSearchResult,
} from 'src/http-client';

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

    // Shared decks
    getAllSharedDecks: emptyProps(),
    'getAllSharedDecks Success': props<{ sharedDecks: SharedDeckSearchResult[] }>(),
    'getAllSharedDecks Failure': emptyProps(),
    getSharedDecks: props<{ pageIndex: number; pageSize: number }>(),
    'getSharedDecks Success': props<{ dataSource: SharedDeckSearchResult[]; totalElements: number }>(),
    'getSharedDecks Failure': emptyProps(),
    createSharedDeck: props<{ decksCreateRequest: SharedDeckCreateRequest }>(),
    'createSharedDeck Success': props<{ deck: Deck }>(),
    'createSharedDeck Failure': emptyProps(),
    editSharedDeck: props<{ deckId: string; decksCreateRequest: SharedDeckCreateRequest }>(),
    'editSharedDeck Success': emptyProps(),
    'editSharedDeck Failure': emptyProps(),
    deleteSharedDeck: props<{ deckId: string }>(),
    'deleteSharedDeck Success': emptyProps(),
    'deleteSharedDeck Failure': emptyProps(),
    setActiveSharedDeck: props<{ deck: SharedDeck }>(),
  },
});
