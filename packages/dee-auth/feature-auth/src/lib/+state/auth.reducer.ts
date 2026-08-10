import { createReducer, on, Action } from '@ngrx/store';

import * as AuthActions from './auth.actions';
import { AuthEntity } from './auth.models';

export const AUTH_FEATURE_KEY = 'auth';

export interface AuthState {
  user: AuthEntity | null;
  loaded: boolean;
  error: string | null;
}

export interface AuthPartialState {
  readonly [AUTH_FEATURE_KEY]: AuthState;
}

export const initialAuthState: AuthState = {
  user: null,
  loaded: false,
  error: null
};

const reducer = createReducer(
  initialAuthState,

  on(AuthActions.initAuth, (state) => ({
    ...state,
    loaded: false,
    error: null
  })),

  on(AuthActions.loadAuthSuccess, (state, { auth }) => ({
    ...state,
    user: auth,
    loaded: true,
    error: null
  })),

  on(AuthActions.loadAuthFailure, (state, { error }) => ({
    ...state,
    user: null,
    loaded: true,
    error
  }))
);

export function authReducer(
  state: AuthState | undefined,
  action: Action
): AuthState {
  return reducer(state, action);
}
