import { PopularTagType } from '@app/shared/types/popularTag.type';
import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const getPopularTagsAction = createActionGroup({
  source: 'popularTags',
  events: {
    'Get popular tags': emptyProps(),
    'Get popular tags success': props<{ popularTags: PopularTagType[] }>(),
    'Get popular tags failure': emptyProps(),
  },
});
