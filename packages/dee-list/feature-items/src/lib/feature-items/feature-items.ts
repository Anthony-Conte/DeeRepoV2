import { Component, inject, OnInit } from '@angular/core';
import { ItemsFacade } from '../+state/items.facade';
import { AsyncPipe } from '@angular/common';
import {
  CreateItemDto,
  Item
} from 'packages/shared/models/src/lib/dee-list/item.model';
import { DeeButton, DeeInput, DeeTile } from '@org/shared-ui';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
@Component({
  selector: 'lib-feature-items',
  imports: [AsyncPipe, DeeButton, DeeInput, DeeTile, ReactiveFormsModule],
  templateUrl: './feature-items.html',
  styleUrl: './feature-items.css'
})
export class FeatureItemsComponent implements OnInit {
  public showRemoveView = false;

  public itemsFacade = inject(ItemsFacade);
  private readonly fb = inject(FormBuilder);

  readonly itemForm = this.fb.nonNullable.group({
    itemName: ['', [Validators.required]]
  });

  public ngOnInit(): void {
    this.itemsFacade.initItems();
  }

  public addItem(): void {
    const newItem: CreateItemDto = {
      name: this.itemForm.get('itemName')?.value || '',
      selected: true
    };
    this.itemsFacade.addItem(newItem);
    this.itemForm.reset();
  }

  public removeItem(itemId: string): void {
    this.itemsFacade.removeItem(itemId);
  }

  public updateItemSelected(item: Item, selected: boolean): void {
    this.itemsFacade.updateItemSelected(item, selected);
  }

  public toggleRemoveView(): void {
    this.showRemoveView = !this.showRemoveView;
  }
}
