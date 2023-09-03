import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';

import { GlobalFeedService } from '../globalFeed.service';
import { feedActions } from './actions';
import { GetFeedResponseInterface } from '../globalFeed.types';

export const getFeedEffect = createEffect(
  (actions$ = inject(Actions), feedService = inject(GlobalFeedService)) => {
    return actions$.pipe(
      ofType(feedActions.getFeed),
      switchMap(({ url }) => {
        return feedService.getFeed(url).pipe(
          map((feed: GetFeedResponseInterface) => {
            return feedActions.getFeedSuccess({ feed });
          }),
          catchError(() => of(feedActions.getFeedFailure())),
        );
      }),
    );
  },
  { functional: true },
);
