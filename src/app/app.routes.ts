import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { authGuard } from './auth/auth.guard';
import { roleGuard } from './auth/role.guard';
import { ProductFormComponent } from './features/product-form/product-form.component';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./features/home/home.routes').then((m) => m.HOME_ROUTES),
  },

  {
    path: 'login',
    component: LoginComponent,
  },

  {
    path: 'product',
    loadChildren: () =>
      import('./features/product/product.routes').then((m) => m.PRODUCT_ROUTES),
  },

  {
    path: 'profile',
    loadChildren: () =>
      import('./features/profile/profile.routes').then((m) => m.PROFILE_ROUTES),
  },

  {
    path: 'users',
    loadChildren: () =>
      import('./features/users/users.routes').then((m) => m.USERS_ROUTES),
  },
  {
    path: 'admin',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['admin'] },
    children: [
      {
        path: 'products/new',
        component: ProductFormComponent,
      },
      {
        path: 'products/:id/edit',
        component: ProductFormComponent,
      },
    ],
  },
];
