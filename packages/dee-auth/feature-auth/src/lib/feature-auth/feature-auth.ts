import { Component, inject } from '@angular/core';
import { AuthFacade } from '../+state/auth.facade';
import { DeeButton } from '@org/shared-ui';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'lib-feature-auth',
  imports: [DeeButton, AsyncPipe],
  templateUrl: './feature-auth.html',
  styleUrl: './feature-auth.css'
})
export class FeatureAuthComponent {
  public authFacade = inject(AuthFacade);
}
