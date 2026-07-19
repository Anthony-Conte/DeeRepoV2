import { Component, inject, OnInit } from '@angular/core';
import { ItemsFacade } from '../+state/items.facade';
import { AsyncPipe } from '@angular/common';
import {
  CreateItemDto,
  Item
} from 'packages/shared/models/src/lib/dee-list/item.model';
import { DeeButton, DeeInput } from '@org/shared-ui';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'lib-feature-items',
  imports: [AsyncPipe, DeeButton, DeeInput, FormsModule],
  templateUrl: './feature-items.html',
  styleUrl: './feature-items.css'
})
export class FeatureItemsComponent implements OnInit {
  public newItemName = '';
  public itemsFacade = inject(ItemsFacade);

  public ngOnInit(): void {
    this.itemsFacade.initItems();
  }

  public addItem(): void {
    const newItem: CreateItemDto = {
      name: this.newItemName,
      selected: true
    };
    this.itemsFacade.addItem(newItem);
    this.newItemName = '';
  }

  public removeItem(itemId: string): void {
    this.itemsFacade.removeItem(itemId);
  }

  public updateItemSelected(item: Item, selected: boolean): void {
    this.itemsFacade.updateItemSelected(item, selected);
  }
}
