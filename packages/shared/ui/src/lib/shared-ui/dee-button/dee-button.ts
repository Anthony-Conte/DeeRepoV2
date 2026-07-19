import { Component, Input } from '@angular/core';

@Component({
  selector: 'lib-dee-button',
  imports: [],
  templateUrl: './dee-button.html',
  styleUrl: './dee-button.css'
})
export class DeeButton {
  @Input() public variant: 'primary' | 'secondary' | 'error' = 'primary';
}
