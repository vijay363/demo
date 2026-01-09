import { Routes } from '@angular/router';
import { authGuard } from '../../auth/guards/auth.guard';
import { roleGuard } from '../../auth/guards/role.guard';
import { SignatureListComponent } from './signature-list/signature-list.component';
import { SignatureComponent } from './signature/signature.component';

export const SIGNATURES_ROUTES: Routes = [
  {
    path: '',
    component: SignatureListComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['admin'] },
    children: [
      {
        path: 'add',
        component: SignatureComponent,
      },
      {
        path: 'edit/:id',
        component: SignatureComponent,
      },
    ],
  },
];
