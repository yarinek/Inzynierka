import { createFeature, createReducer, on } from '@ngrx/store';
import { routerNavigationAction } from '@ngrx/router-store';
import { Deck, DeckSearchResult } from 'src/http-client';

import { decksActions } from './actions';

const initialState: {
  dataSource: DeckSearchResult[];
  totalElements: number;
  activeDeck: Deck | null;
  allSharedDecks: DeckSearchResult[];
} = {
  activeDeck: null,
  totalElements: 0,
  dataSource: [],
  allSharedDecks: [],
};

const decksFeature = createFeature({
  name: 'decks',
  reducer: createReducer(
    initialState,
    on(decksActions.getdecks, (state) => ({ ...state })),
    on(decksActions.getdecksSuccess, (state, action) => ({
      ...state,
      dataSource: action.dataSource,
      totalElements: action.totalElements,
    })),
    on(decksActions.getdecksFailure, (state) => ({
      ...state,
    })),
    on(decksActions.createdeckSuccess, (state, action) => ({ ...state, activeDeck: action.deck })),
    on(decksActions.setactivedeck, (state, action) => ({ ...state, activeDeck: action.deck })),
    // Shared decks
    on(decksActions.getallshareddecksSuccess, (state, action) => ({
      ...state,
      allSharedDecks: action.sharedDecks,
    })),
    on(decksActions.getshareddecks, (state) => ({ ...state })),
    on(decksActions.getshareddecksSuccess, (state, action) => ({
      ...state,
      dataSource: action.dataSource,
      totalElements: action.totalElements,
    })),
    on(decksActions.getshareddecksFailure, (state) => ({
      ...state,
    })),
    on(decksActions.createshareddeckSuccess, (state, action) => ({ ...state, activeDeck: action.deck })),
    on(decksActions.setactiveshareddeck, (state, action) => ({ ...state, activeDeck: action.deck })),
    on(routerNavigationAction, (state) => ({ ...state })),
  ),
});

export const {
  name: decksFeatureKey,
  reducer: decksReducer,
  selectDataSource,
  selectActiveDeck,
  selectTotalElements,
  selectAllSharedDecks,
} = decksFeature;
