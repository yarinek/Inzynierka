import { createActionGroup, emptyProps, props } from '@ngrx/store';
import {
  AccountUpdate,
  DefaultUserDeckSettings,
  DefaultUserGrammarSettings,
  Language,
  UserGrammarSettingsSearchResults,
  UserGrammarSettingsUpsert,
  UserSettings,
} from 'src/http-client';

export const settingsActions = createActionGroup({
  source: 'settings',
  events: {
    ChangeEmail: props<{ accountId: string; accountUpdate: AccountUpdate }>(),
    'ChangeEmail Success': emptyProps(),
    'ChangeEmail Failure': emptyProps(),

    ResetPassword: emptyProps(),
    'ResetPassword Success': emptyProps(),
    'ResetPassword Failure': emptyProps(),

    VerifyPassword: props<{ token: string; newPassword: string }>(),
    'VerifyPassword Success': emptyProps(),
    'VerifyPassword Failure': emptyProps(),

    GetUserSettings: emptyProps(),
    'GetUserSettings Success': props<{ userSettings: UserSettings }>(),
    'GetUserSettings Failure': emptyProps(),

    SaveUserSettings: emptyProps(),
    'SaveUserSettings Success': emptyProps(),
    'SaveUserSettings Failure': emptyProps(),

    GetGrammarSettings: emptyProps(),
    'GetGrammarSettings Success': props<{ grammarSettings: UserGrammarSettingsSearchResults }>(),
    'GetGrammarSettings Failure': emptyProps(),

    SaveGrammarSettings: props<{ userGrammarSettingsUpsert: UserGrammarSettingsUpsert[] }>(),
    'SaveGrammarSettings Success': emptyProps(),
    'SaveGrammarSettings Failure': emptyProps(),

    ChangeDisplayLanguage: props<{ language: Language }>(),
    ChangeInstructionLanguage: props<{ language: Language }>(),
    ChangeDeckSettings: props<{ deckSettings: DefaultUserDeckSettings }>(),
    ChangeExercisesSettings: props<{ exercisesSettings: DefaultUserGrammarSettings }>(),
  },
});
