import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-dee-tile',
  imports: [CommonModule],
  templateUrl: './dee-tile.html',
  styleUrl: './dee-tile.css'
})
export class DeeTile {
  @Input() public header?: string;
  @Input() public footer?: string;
}
