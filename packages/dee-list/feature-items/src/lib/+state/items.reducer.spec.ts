import { Action } from '@ngrx/store';

import * as ItemsActions from './items.actions';
import { ItemsEntity } from './items.models';
import { ItemsState, initialItemsState, itemsReducer } from './items.reducer';

describe('Items Reducer', () => {
  const createItemsEntity = (id: string, name = ''): ItemsEntity => ({
    id,
    name: name || `name-${id}`,
  });

  describe('valid Items actions', () => {
    it('loadItemsSuccess should return the list of known Items', () => {
      const items = [
        createItemsEntity('PRODUCT-AAA'),
        createItemsEntity('PRODUCT-zzz'),
      ];
      const action = ItemsActions.loadItemsSuccess({ items });

      const result: ItemsState = itemsReducer(initialItemsState, action);

      expect(result.loaded).toBe(true);
      expect(result.ids.length).toBe(2);
    });
  });

  describe('unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as Action;

      const result = itemsReducer(initialItemsState, action);

      expect(result).toBe(initialItemsState);
    });
  });
});
