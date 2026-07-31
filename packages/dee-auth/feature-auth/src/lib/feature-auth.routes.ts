import { Routes } from '@angular/router';
import { FeatureAuthComponent } from './feature-auth/feature-auth';
import { provideStore, provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import * as fromAuth from './+state/auth.reducer';
import { AuthEffects } from './+state/auth.effects';

export const FEATURE_AUTH_ROUTES: Routes = [
  {
    path: '',
    component: FeatureAuthComponent,
    providers: [
      provideState(fromAuth.AUTH_FEATURE_KEY, fromAuth.authReducer),
      provideEffects(AuthEffects)
    ]
  }
];
