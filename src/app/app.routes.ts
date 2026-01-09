import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { roleGuard } from './auth/guards/role.guard';
import { authGuard } from './auth/guards/auth.guard';
import { ProductFormComponent } from './features/products/product-form/product-form.component';

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
      import('./features/products/product.routes').then((m) => m.PRODUCT_ROUTES),
  },

  {
    path: 'profile',
    loadChildren: () =>
      import('./features/profile/profile.routes').then((m) => m.PROFILE_ROUTES),
  },

  {
    path: 'users',
    loadChildren: () =>
      import('./features/user/users.routes').then((m) => m.USERS_ROUTES),
  },
  {
    path: 'charts',
    loadChildren: () =>
      import('./features/charts/chart.routes').then((m) => m.CHART_ROUTES),
  },
     {
    path: 'signatures',
    loadChildren: () =>
      import('./features/signatures/signatures.routes').then((m) => m.SIGNATURES_ROUTES),
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
