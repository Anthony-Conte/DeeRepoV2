import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { addItem, initItems, removeItem } from './items.actions';
import { selectAllItems } from './items.selectors';
import { CreateItemDto } from '@org/models';

@Injectable({
  providedIn: 'root'
})
export class ItemsFacade {
  private store = inject(Store);

  public items$ = this.store.select(selectAllItems);

  public initItems(): void {
    this.store.dispatch(initItems());
  }

  public addItem(item: CreateItemDto): void {
    this.store.dispatch(addItem({ item }));
  }

  public removeItem(itemId: string): void {
    this.store.dispatch(removeItem({ itemId }));
  }
}
