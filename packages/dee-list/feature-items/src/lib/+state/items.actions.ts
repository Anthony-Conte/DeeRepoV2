import { createAction, props } from '@ngrx/store';
import { Item } from 'packages/shared/models/src/lib/dee-list/item.model';

export const initItems = createAction('[Items Page] Init');

export const loadItemsSuccess = createAction(
  '[Items/API] Load Items Success',
  props<{ items: Item[] }>(),
);

export const loadItemsFailure = createAction(
  '[Items/API] Load Items Failure',
  props<{ error: any }>(),
);
