import { Routes } from '@angular/router';
import { ProductComponent } from './product.component';
import { authGuard } from '../../auth/auth.guard';
import { ProductDetailComponent } from '../product-detail/product-detail.component';

export const PRODUCT_ROUTES: Routes = [
  {
    path: '',
    component: ProductComponent,
    canActivate: [authGuard],
    pathMatch: 'full',
  },
  {
    path: ':slug',
    component: ProductDetailComponent,
  },
];
