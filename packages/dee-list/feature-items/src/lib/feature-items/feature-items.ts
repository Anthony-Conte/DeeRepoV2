import { Component, inject, OnInit } from '@angular/core';
import { ItemsFacade } from '../+state/items.facade';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'lib-feature-items',
  imports: [AsyncPipe],
  templateUrl: './feature-items.html',
  styleUrl: './feature-items.css',
})
export class FeatureItemsComponent implements OnInit {
  public itemsFacade = inject(ItemsFacade);

  public ngOnInit(): void {
    this.itemsFacade.initItems();
  }
}
