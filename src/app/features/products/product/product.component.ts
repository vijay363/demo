import {
  Component,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { CommonService } from '../../../shared/services/common.service';
import { CommonModule } from '@angular/common';
import { Category, Product } from '../../../shared/models/model';
import { RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../auth/services/auth.service';
import { FormsModule } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-product',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss',
})
export class ProductComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  categories: Category[] = [];
  page = 0;
  limit = 10;
  loading = false;
  hasMore = true;
  isAdmin = false;
  sortType: 'priceAsc' | 'priceDesc' | null = null;

  filters = {
    title: '',
    categoryId: null as number | null,
    priceMin: null as number | null,
    priceMax: null as number | null,
  };

  private observer!: IntersectionObserver;
  private authService = inject(AuthService);

  @ViewChild('anchor', { static: true })
  anchor!: ElementRef<HTMLElement>;

  private commonService = inject(CommonService);
  private toast = inject(ToastrService);

  ngOnInit() {
    this.isAdmin = this.authService.hasRole('admin');

    this.loadCategories();
    this.loadProducts();
    this.initIntersectionObserver();
  }

  loadProducts() {
    if (this.loading || !this.hasMore) return;

    this.loading = true;

    this.commonService
      .getProductsFiltered({
        ...this.filters,
        page: this.page,
        limit: this.limit,
      })
      .subscribe({
        next: (data) => {
          const sorted = this.applySorting(data);
          this.products = [...this.products, ...sorted];
          this.page++;
          this.loading = false;

          if (data.length < this.limit) {
            this.hasMore = false;
            this.observer.disconnect();
          }
        },
        error: () => {
          this.loading = false;
          this.toast.error('Failed to load products');
        },
      });
  }

  onSearch(value: string) {
    this.filters.title = value;
    this.resetAndReload();
  }

  onCategoryChange(value: string) {
    this.filters.categoryId = value ? +value : null;
    this.resetAndReload();
  }

  onMinPrice(value: string) {
    const num = Number(value);
    this.filters.priceMin = isNaN(num) ? null : num;
    this.resetAndReload();
  }

  onMaxPrice(value: string) {
    const num = Number(value);
    this.filters.priceMax = isNaN(num) ? null : num;
    this.resetAndReload();
  }

  onSort(value: string) {
    this.sortType = value ? (value as any) : null;
    this.resetAndReload();
  }

  applySorting(products: Product[]) {
    if (this.sortType === 'priceAsc') {
      return products.sort((a, b) => a.price - b.price);
    }

    if (this.sortType === 'priceDesc') {
      return products.sort((a, b) => b.price - a.price);
    }

    return products;
  }

  resetAndReload() {
    this.page = 0;
    this.products = [];
    this.hasMore = true;
    this.observer.disconnect();
    this.loadProducts();
    this.initIntersectionObserver();
  }

  initIntersectionObserver() {
    this.observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          this.loadProducts();
        }
      },
      { threshold: 0.3 }
    );

    this.observer.observe(this.anchor.nativeElement);
  }

  ngOnDestroy() {
    this.observer?.disconnect();
  }

  trackById(_: number, item: Product) {
    return item.id;
  }

  deleteProduct(id: number) {
    if (!confirm('Are you sure you want to delete this product?')) return;

    this.commonService.deleteProduct(id).subscribe({
      next: () => {
        this.products = this.products.filter((p) => p.id !== id);
        this.toast.success('Product deleted successfully');
      },
      error: () => this.toast.error('Failed to delete product'),
    });
  }

  nextImage(product: any) {
    product.currentImageIndex =
      (product.currentImageIndex + 1) % product.images.length || 0;
  }

  prevImage(product: any) {
    product.currentImageIndex =
      (product.currentImageIndex - 1 + product.images.length) %
        product.images.length || 0;
  }

  loadCategories() {
    this.commonService.getCategories().subscribe((c) => (this.categories = c));
  }
  resetFilters() {
    this.filters = {
      title: '',
      categoryId: null,
      priceMin: null,
      priceMax: null,
    };

    this.sortType = null;

    this.page = 0;
    this.products = [];
    this.hasMore = true;

    this.observer.disconnect();
    this.loadProducts();
    this.initIntersectionObserver();
  }
}
