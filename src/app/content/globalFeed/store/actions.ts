import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { GetFeedResponseInterface } from '../globalFeed.types';

export const feedActions = createActionGroup({
  source: 'feed',
  events: {
    'Get feed': props<{ url: string }>(),
    'Get feed success': props<{ feed: GetFeedResponseInterface }>(),
    'Get feed failure': emptyProps(),
  },
});
