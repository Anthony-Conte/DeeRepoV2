import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { hot } from 'jasmine-marbles';
import { Observable } from 'rxjs';

import * as ItemsActions from './items.actions';
import { ItemsEffects } from './items.effects';

describe('ItemsEffects', () => {
  let actions: Observable<Action>;
  let effects: ItemsEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        ItemsEffects,
        provideMockActions(() => actions),
        provideMockStore(),
      ],
    });

    effects = TestBed.inject(ItemsEffects);
  });

  describe('init$', () => {
    it('should work', () => {
      actions = hot('-a-|', { a: ItemsActions.initItems() });

      const expected = hot('-a-|', {
        a: ItemsActions.loadItemsSuccess({ items: [] }),
      });

      expect(effects.init$).toBeObservable(expected);
    });
  });
});
