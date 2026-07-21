import { Injectable, inject } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { switchMap, catchError, of, map } from 'rxjs';
import * as ItemsActions from './items.actions';
import { HttpClient } from '@angular/common/http';
import { Item } from 'packages/shared/models/src/lib/dee-list/item.model';

@Injectable()
export class ItemsEffects {
  private actions$ = inject(Actions);
  private httpClient = inject(HttpClient);

  init$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ItemsActions.initItems),
      switchMap(() =>
        this.httpClient
          .get<Item[]>('http://localhost:3000/api/items', {
            withCredentials: true
          })
          .pipe(
            map((items) => ItemsActions.loadItemsSuccess({ items })),
            catchError((error) => {
              console.error('Error', error);
              return of(ItemsActions.loadItemsFailure({ error }));
            })
          )
      )
    )
  );

  addItem$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ItemsActions.addItem),
      switchMap(({ item }) =>
        this.httpClient
          .post<Item>('http://localhost:3000/api/items', item, {
            withCredentials: true
          })
          .pipe(
            map((item) => ItemsActions.addItemSuccess({ item })),
            catchError((error) => {
              console.error('Error', error);
              return of(ItemsActions.addItemFailure({ error }));
            })
          )
      )
    )
  );

  removeItem$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ItemsActions.removeItem),
      switchMap(({ itemId }) =>
        this.httpClient
          .delete<Item>(`http://localhost:3000/api/items/${itemId}`, {
            withCredentials: true
          })
          .pipe(
            map(() => ItemsActions.removeItemSuccess({ itemId })),
            catchError((error) => {
              console.error('Error', error);
              return of(ItemsActions.removeItemFailure({ error }));
            })
          )
      )
    )
  );

  updateItem$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ItemsActions.updateItem),
      switchMap(({ itemId, item }) =>
        this.httpClient
          .patch<Item>(`http://localhost:3000/api/items/${itemId}`, item, {
            withCredentials: true
          })
          .pipe(
            map((updatedItem) =>
              ItemsActions.updateItemSuccess({ item: updatedItem })
            ),
            catchError((error) => {
              console.error('Error', error);
              return of(ItemsActions.updateItemFailure({ error }));
            })
          )
      )
    )
  );
}
