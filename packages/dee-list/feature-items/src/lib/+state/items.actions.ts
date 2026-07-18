import { createAction, props } from '@ngrx/store';
import {
  CreateItemDto,
  Item
} from 'packages/shared/models/src/lib/dee-list/item.model';

export const initItems = createAction('[Items Page] Init');

export const loadItemsSuccess = createAction(
  '[Items/API] Load Items Success',
  props<{ items: Item[] }>()
);

export const loadItemsFailure = createAction(
  '[Items/API] Load Items Failure',
  props<{ error: any }>()
);

export const addItem = createAction(
  '[Items Page] Add Item',
  props<{ item: CreateItemDto }>()
);

export const addItemSuccess = createAction(
  '[Items/API] Add Item Success',
  props<{ item: Item }>()
);

export const addItemFailure = createAction(
  '[Items/API] Add Item Failure',
  props<{ error: any }>()
);

export const removeItem = createAction(
  '[Items Page] Remove Item',
  props<{ itemId: string }>()
);

export const removeItemSuccess = createAction(
  '[Items/API] Remove Item Success',
  props<{ itemId: string }>()
);

export const removeItemFailure = createAction(
  '[Items/API] Remove Item Failure',
  props<{ error: any }>()
);

export const updateItem = createAction(
  '[Items Page] Update Item',
  props<{ itemId: string; item: CreateItemDto }>()
);

export const updateItemSuccess = createAction(
  '[Items/API] Update Item Success',
  props<{ item: Item }>()
);

export const updateItemFailure = createAction(
  '[Items/API] Update Item Failure',
  props<{ error: any }>()
);
