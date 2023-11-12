import { createFeature, createReducer, on } from '@ngrx/store';
import { routerNavigationAction } from '@ngrx/router-store';
import { UserSettings, UserSiteSettings } from 'src/http-client';

import { settingsActions } from './actions';

const initialState: {
  userSettings: UserSettings | null;
} = {
  userSettings: null,
};

const settingsFeature = createFeature({
  name: 'settings',
  reducer: createReducer(
    initialState,
    on(settingsActions.getusersettingsSuccess, (state, action) => ({
      ...state,
      userSettings: action.userSettings,
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
    on(settingsActions.changegrammarsettings, (state, action) => ({
      ...state,
      userSettings: {
        ...(state.userSettings as UserSettings),
        defaultGrammarSettings: action.grammarSettings,
      },
    })),
    on(routerNavigationAction, (state) => ({ ...state })),
  ),
});

export const { name: settingsFeatureKey, reducer: settingsReducer, selectUserSettings } = settingsFeature;
