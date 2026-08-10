import { createFeatureSelector, createSelector } from '@ngrx/store';

import { AUTH_FEATURE_KEY, AuthState } from './auth.reducer';

// Lookup the 'Auth' feature state managed by NgRx
export const selectAuthState =
  createFeatureSelector<AuthState>(AUTH_FEATURE_KEY);

export const selectAuthLoaded = createSelector(
  selectAuthState,
  (state) => state.loaded
);

export const selectAuthError = createSelector(
  selectAuthState,
  (state) => state.error
);

export const selectCurrentUser = createSelector(
  selectAuthState,
  (state) => state.user
);

export const selectIsAuthenticated = createSelector(
  selectCurrentUser,
  (user) => user !== null
);
