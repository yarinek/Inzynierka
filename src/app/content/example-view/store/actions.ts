import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { ExampleInterface } from '../example.types';

export const exampleActions = createActionGroup({
  source: 'example',
  events: {
    'Get example': props<{ url: string }>(),
    'Get example success': props<{ example: ExampleInterface }>(),
    'Get example failure': emptyProps(),
  },
});
