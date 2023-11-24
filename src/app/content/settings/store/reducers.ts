import { createFeature, createReducer, on } from '@ngrx/store';
import { routerNavigationAction } from '@ngrx/router-store';
import { UserGrammarSettingsSearchResults, UserSettings, UserSiteSettings } from 'src/http-client';

import { settingsActions } from './actions';

const initialState: {
  userSettings: UserSettings | null;
  grammarSettings: UserGrammarSettingsSearchResults | null;
} = {
  userSettings: null,
  grammarSettings: null,
};

const settingsFeature = createFeature({
  name: 'settings',
  reducer: createReducer(
    initialState,
    on(settingsActions.getusersettingsSuccess, (state, action) => ({
      ...state,
      userSettings: action.userSettings,
    })),
    on(settingsActions.getgrammarsettingsSuccess, (state, action) => ({
      ...state,
      grammarSettings: action.grammarSettings,
    })),
    on(settingsActions.changedisplaylanguage, (state, action) => ({
      ...state,
      userSettings: {
        ...(state.userSettings as UserSettings),
        siteSettings: {
          ...(state.userSettings?.siteSettings as UserSiteSettings),
          displayLanguage: action.language,
        },
      },
    })),
    on(settingsActions.changeinstructionlanguage, (state, action) => ({
      ...state,
      userSettings: {
        ...(state.userSettings as UserSettings),
        siteSettings: {
          ...(state.userSettings?.siteSettings as UserSiteSettings),
          instructionsLanguage: action.language,
        },
      },
    })),
    on(settingsActions.changedecksettings, (state, action) => ({
      ...state,
      userSettings: {
        ...(state.userSettings as UserSettings),
        defaultDecksSettings: action.deckSettings,
      },
    })),
    on(settingsActions.changeexercisessettings, (state, action) => ({
      ...state,
      userSettings: {
        ...(state.userSettings as UserSettings),
        defaultGrammarSettings: action.exercisesSettings,
      },
    })),
    on(routerNavigationAction, (state) => ({ ...state })),
  ),
});

export const {
  name: settingsFeatureKey,
  reducer: settingsReducer,
  selectUserSettings,
  selectGrammarSettings,
} = settingsFeature;
