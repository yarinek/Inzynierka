import { createFeature, createReducer, on } from '@ngrx/store';
import { routerNavigationAction } from '@ngrx/router-store';
import { Card } from 'src/http-client';

import { cardsActions } from './actions';

const initialState: {
  dataSource: Card[];
  previewCard: Card | null;
} = {
  dataSource: [],
  previewCard: null,
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
    on(cardsActions.getcard, (state) => ({ ...state })),
    on(cardsActions.getcardSuccess, (state, action) => ({
      ...state,
      previewCard: action.card,
    })),
    on(cardsActions.getcardFailure, (state) => ({
      ...state,
    })),
    on(routerNavigationAction, (state) => ({ ...state })),
  ),
});

export const { name: cardsFeatureKey, reducer: cardsReducer, selectDataSource, selectPreviewCard } = decksFeature;
