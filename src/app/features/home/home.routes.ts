import { Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { authGuard } from '../../auth/auth.guard';

export const HOME_ROUTES: Routes = [
  { path: '', component: HomeComponent, canActivate: [authGuard] }
];
