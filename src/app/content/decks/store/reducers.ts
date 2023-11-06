import { createFeature, createReducer, on } from '@ngrx/store';
import { routerNavigationAction } from '@ngrx/router-store';
import { DeckSearchResult } from 'src/http-client';

import { decksActions } from './actions';

const initialState: {
  dataSource: DeckSearchResult[];
  activeDeckId: string;
} = {
  activeDeckId: '',
  dataSource: [],
};

const decksFeature = createFeature({
  name: 'decks',
  reducer: createReducer(
    initialState,
    on(decksActions.getdecks, (state) => ({ ...state })),
    on(decksActions.getdecksSuccess, (state, action) => ({
      ...state,
      dataSource: action.dataSource,
    })),
    on(decksActions.getdecksFailure, (state) => ({
      ...state,
    })),
    on(decksActions.setactivedeck, (state, action) => ({ ...state, activeDeckId: action.deckId })),
    on(routerNavigationAction, (state) => ({ ...state })),
  ),
});

export const { name: decksFeatureKey, reducer: decksReducer, selectDataSource, selectActiveDeckId } = decksFeature;
