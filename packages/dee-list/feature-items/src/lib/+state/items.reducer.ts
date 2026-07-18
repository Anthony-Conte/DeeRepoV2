import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on, Action } from '@ngrx/store';

import * as ItemsActions from './items.actions';
import { Item } from 'packages/shared/models/src/lib/dee-list/item.model';

export const ITEMS_FEATURE_KEY = 'items';

export interface ItemsState extends EntityState<Item> {
  selectedId?: string | number; // which Items record has been selected
  loaded: boolean; // has the Items list been loaded
  error?: string | null; // last known error (if any)
}

export interface ItemsPartialState {
  readonly [ITEMS_FEATURE_KEY]: ItemsState;
}

export const itemsAdapter: EntityAdapter<Item> = createEntityAdapter<Item>();

export const initialItemsState: ItemsState = itemsAdapter.getInitialState({
  // set initial required properties
  loaded: false
});

const reducer = createReducer(
  initialItemsState,
  on(ItemsActions.initItems, (state) => ({
    ...state,
    loaded: false,
    error: null
  })),
  on(ItemsActions.loadItemsSuccess, (state, { items }) =>
    itemsAdapter.setAll(items, { ...state, loaded: true })
  ),
  on(ItemsActions.loadItemsFailure, (state, { error }) => ({
    ...state,
    error
  })),
  on(ItemsActions.addItem, (state) => ({
    ...state,
    loaded: false,
    error: null
  })),
  on(ItemsActions.addItemFailure, (state, { error }) => ({
    ...state,
    error
  })),
  on(ItemsActions.addItemSuccess, (state, { item }) =>
    itemsAdapter.addOne(item, state)
  ),
  on(ItemsActions.removeItem, (state) => ({
    ...state,
    loaded: false,
    error: null
  })),
  on(ItemsActions.removeItemFailure, (state, { error }) => ({
    ...state,
    error
  })),
  on(ItemsActions.removeItemSuccess, (state, { itemId }) =>
    itemsAdapter.removeOne(itemId, state)
  ),
  on(ItemsActions.updateItem, (state) => ({
    ...state,
    loaded: false,
    error: null
  })),
  on(ItemsActions.updateItemFailure, (state, { error }) => ({
    ...state,
    error
  })),
  on(ItemsActions.updateItemSuccess, (state, { item }) =>
    itemsAdapter.updateOne({ id: item.id, changes: item }, state)
  )
);

export function itemsReducer(state: ItemsState | undefined, action: Action) {
  return reducer(state, action);
}
