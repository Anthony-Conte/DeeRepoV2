import { Component, inject, OnInit } from '@angular/core';
import { ItemsFacade } from '../+state/items.facade';
import { AsyncPipe } from '@angular/common';
import {
  CreateItemDto,
  Item
} from 'packages/shared/models/src/lib/dee-list/item.model';

@Component({
  selector: 'lib-feature-items',
  imports: [AsyncPipe],
  templateUrl: './feature-items.html',
  styleUrl: './feature-items.css'
})
export class FeatureItemsComponent implements OnInit {
  public itemsFacade = inject(ItemsFacade);

  public ngOnInit(): void {
    this.itemsFacade.initItems();
  }

  public addItem(): void {
    const newItem: CreateItemDto = {
      name: 'New Item',
      selected: true
    };
    this.itemsFacade.addItem(newItem);
  }

  public removeItem(itemId: string): void {
    this.itemsFacade.removeItem(itemId);
  }

  public updateItemSelected(item: Item, selected: boolean): void {
    this.itemsFacade.updateItemSelected(item, selected);
  }
}
