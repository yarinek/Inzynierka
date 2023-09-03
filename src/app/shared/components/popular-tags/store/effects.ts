import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { PopularTagType } from '@app/shared/types/popularTag.type';

import { PopularTagsService } from '../popular-tags.service';
import { getPopularTagsAction } from './actions';

export const getPopularTagsEffect = createEffect(
  (actions$ = inject(Actions), popularTagsService = inject(PopularTagsService)) => {
    return actions$.pipe(
      ofType(getPopularTagsAction.getPopularTags),
      switchMap(() => {
        return popularTagsService.getPopularTags().pipe(
          map((popularTags: PopularTagType[]) => {
            return getPopularTagsAction.getPopularTagsSuccess({ popularTags });
          }),
          catchError(() => of(getPopularTagsAction.getPopularTagsFailure())),
        );
      }),
    );
  },
  { functional: true },
);
