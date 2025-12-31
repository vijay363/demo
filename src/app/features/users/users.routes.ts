import { Routes } from '@angular/router';
import { UsersComponent } from './users.component';
import { UserFormComponent } from '../user-form/user-form.component';
import { authGuard } from '../../auth/auth.guard';
import { roleGuard } from '../../auth/role.guard';

export const USERS_ROUTES: Routes = [
  {
    path: '',
    component: UsersComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['admin'] },
  },
  {
    path: 'user-form',
    component: UserFormComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['admin'] },
  },
  {
    path: 'user-form/:id',
    component: UserFormComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['admin'] },
  },
];
