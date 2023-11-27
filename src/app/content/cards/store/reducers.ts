import { createFeature, createReducer, on } from '@ngrx/store';
import { routerNavigationAction } from '@ngrx/router-store';
import { Card } from 'src/http-client';

import { cardsActions } from './actions';

const initialState: {
  dataSource: Card[];
  totalElements: number;
  previewCard: Card | null;
} = {
  dataSource: [],
  totalElements: 0,
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
      totalElements: action.totalElements,
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
    on(cardsActions.createcardSuccess, (state, action) => ({ ...state, previewCard: action.card })),
    on(cardsActions.submitanswer, (state) => ({ ...state })),
    on(cardsActions.submitanswerSuccess, (state, action) => ({
      ...state,
      previewCard: action.card,
    })),
    on(cardsActions.submitanswerFailure, (state) => ({
      ...state,
      previewCard: null,
    })),
    on(cardsActions.startactivity, (state) => ({ ...state })),
    on(cardsActions.startactivitySuccess, (state, action) => ({
      ...state,
      previewCard: action.card,
    })),
    on(cardsActions.startactivityFailure, (state) => ({
      ...state,
      previewCard: null,
    })),
    // Shared cards
    on(cardsActions.getsharedcards, (state) => ({ ...state })),
    on(cardsActions.getsharedcardsSuccess, (state, action) => ({
      ...state,
      dataSource: action.dataSource,
      totalElements: action.totalElements,
    })),
    on(cardsActions.getsharedcardsFailure, (state) => ({
      ...state,
    })),
    on(routerNavigationAction, (state) => ({ ...state, dataSource: [], totalElements: 0 })),
  ),
});

export const {
  name: cardsFeatureKey,
  reducer: cardsReducer,
  selectDataSource,
  selectPreviewCard,
  selectTotalElements,
} = decksFeature;
