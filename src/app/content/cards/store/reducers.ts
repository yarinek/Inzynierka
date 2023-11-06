import { createFeature, createReducer, on } from '@ngrx/store';
import { routerNavigationAction } from '@ngrx/router-store';
import { DeckSearchResult } from 'src/http-client';

import { cardsActions } from './actions';

const initialState: {
  dataSource: DeckSearchResult[];
} = {
  dataSource: [],
};

const decksFeature = createFeature({
  name: 'cards',
  reducer: createReducer(
    initialState,
    on(cardsActions.getcards, (state) => ({ ...state })),
    on(cardsActions.getcardsSuccess, (state, action) => ({
      ...state,
      dataSource: action.dataSource,
    })),
    on(cardsActions.getcardsFailure, (state) => ({
      ...state,
    })),
    on(routerNavigationAction, (state) => ({ ...state })),
  ),
});

export const { name: cardsFeatureKey, reducer: cardsReducer, selectDataSource } = decksFeature;
