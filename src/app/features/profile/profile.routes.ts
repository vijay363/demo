import { Routes } from '@angular/router';
import { ProfileComponent } from './profile.component';
import { authGuard } from '../../auth/guards/auth.guard';

export const PROFILE_ROUTES: Routes = [
  { path: '', component: ProfileComponent, canActivate: [authGuard] }
];
