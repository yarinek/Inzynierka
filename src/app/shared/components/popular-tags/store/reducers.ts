import { createFeature, createReducer, on } from '@ngrx/store';

import { getPopularTagsAction } from './actions';
import { PopularTagsStateInterface } from '../popular-tags.types';

const initialState: PopularTagsStateInterface = {
  isLoading: false,
  error: null,
  data: null,
};

const popularTagsFeature = createFeature({
  name: 'popularTags',
  reducer: createReducer(
    initialState,
    on(getPopularTagsAction.getPopularTags, (state) => ({ ...state, isLoading: true })),
    on(getPopularTagsAction.getPopularTagsSuccess, (state, action) => ({
      ...state,
      isLoading: false,
      data: action.popularTags,
    })),
    on(getPopularTagsAction.getPopularTagsFailure, (state) => ({ ...state, isLoading: false })),
  ),
});

export const {
  name: popularTagsFeatureKey,
  reducer: popularTagsReducer,
  selectIsLoading,
  selectError,
  selectData: selectPopularTagsData,
} = popularTagsFeature;
