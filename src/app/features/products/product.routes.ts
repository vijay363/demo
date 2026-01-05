import { Routes } from '@angular/router';
import { ProductComponent } from './product/product.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { authGuard } from '../../auth/guards/auth.guard';

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
