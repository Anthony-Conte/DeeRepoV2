import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { initItems } from './items.actions';
import { selectAllItems } from './items.selectors';

@Injectable({
  providedIn: 'root',
})
export class ItemsFacade {
  private store = inject(Store);

  public items$ = this.store.select(selectAllItems);

  public initItems(): void {
    this.store.dispatch(initItems());
  }
}
