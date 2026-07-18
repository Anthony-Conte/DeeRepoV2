import { Component, inject, OnInit } from '@angular/core';
import { ItemsFacade } from '../+state/items.facade';
import { AsyncPipe } from '@angular/common';
import { CreateItemDto } from 'packages/shared/models/src/lib/dee-list/item.model';

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
      name: 'New Item'
    };
    this.itemsFacade.addItem(newItem);
  }

  public removeItem(itemId: string): void {
    this.itemsFacade.removeItem(itemId);
  }
}
