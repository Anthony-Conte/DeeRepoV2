import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ITEMS_FEATURE_KEY, ItemsState, itemsAdapter } from './items.reducer';

// Lookup the 'Items' feature state managed by NgRx
export const selectItemsState =
  createFeatureSelector<ItemsState>(ITEMS_FEATURE_KEY);

const { selectAll, selectEntities } = itemsAdapter.getSelectors();

export const selectItemsLoaded = createSelector(
  selectItemsState,
  (state: ItemsState) => state.loaded
);

export const selectSelectedItems = createSelector(
  selectItemsState,
  (state: ItemsState) => state.selectedItems
);

export const selectUnselectedItems = createSelector(
  selectItemsState,
  (state: ItemsState) => state.unselectedItems
);

export const selectItemsError = createSelector(
  selectItemsState,
  (state: ItemsState) => state.error
);

export const selectAllItems = createSelector(
  selectItemsState,
  (state: ItemsState) => selectAll(state)
);

export const selectItemsEntities = createSelector(
  selectItemsState,
  (state: ItemsState) => selectEntities(state)
);

export const selectSelectedId = createSelector(
  selectItemsState,
  (state: ItemsState) => state.selectedId
);

export const selectEntity = createSelector(
  selectItemsEntities,
  selectSelectedId,
  (entities, selectedId) => (selectedId ? entities[selectedId] : undefined)
);
