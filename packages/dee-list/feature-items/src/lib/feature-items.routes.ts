import { Routes } from '@angular/router';
import { FeatureItemsComponent } from './feature-items/feature-items';
import { provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import * as fromItems from './+state/items.reducer';
import { ItemsEffects } from './+state/items.effects';

export const FEATURE_ITEMS_ROUTES: Routes = [
  {
    path: '',
    component: FeatureItemsComponent,
    providers: [
      provideState(fromItems.ITEMS_FEATURE_KEY, fromItems.itemsReducer),
      provideEffects(ItemsEffects),
    ],
  },
];
