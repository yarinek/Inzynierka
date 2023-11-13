import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const sharedActions = createActionGroup({
  source: 'shared',
  events: {
    uploadFile: props<{ file: File }>(),
    'uploadFile Success': props<{ url: string }>(),
    'uploadFile Failure': emptyProps(),
  },
});
