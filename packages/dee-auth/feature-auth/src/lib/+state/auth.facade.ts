import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { initAuth } from './auth.actions';
import { selectCurrentUser } from './auth.selectors';

@Injectable({
  providedIn: 'root'
})
export class AuthFacade {
  private store = inject(Store);

  public auth$ = this.store.select(selectCurrentUser);

  public initAuth(): void {
    this.store.dispatch(initAuth());
  }
}
