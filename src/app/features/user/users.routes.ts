import { Routes } from '@angular/router';
import { UsersComponent } from './users/users.component';
import { UserFormComponent } from './user-form/user-form.component';
import { roleGuard } from '../../auth/guards/role.guard';
import { authGuard } from '../../auth/guards/auth.guard';

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
