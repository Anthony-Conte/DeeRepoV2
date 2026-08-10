import { Injectable, inject } from '@angular/core';
import { createEffect, Actions, ofType, OnInitEffects } from '@ngrx/effects';
import { switchMap, catchError, of, map } from 'rxjs';
import * as AuthActions from './auth.actions';
import { HttpClient } from '@angular/common/http';
import { AuthEntity } from './auth.models';

@Injectable()
export class AuthEffects {
  private actions$ = inject(Actions);
  private httpClient = inject(HttpClient);

  init$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.initAuth),
      switchMap(() =>
        this.httpClient
          .get<AuthEntity>('http://localhost:3001/api/auth/me', {
            withCredentials: true
          })
          .pipe(
            map((auth) => AuthActions.loadAuthSuccess({ auth })),
            catchError((error) => {
              console.error('Error', error);
              return of(AuthActions.loadAuthFailure({ error }));
            })
          )
      )
    )
  );
}
