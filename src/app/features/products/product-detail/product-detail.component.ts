import { Component, inject, OnInit } from '@angular/core';
import { CommonService } from '../../../shared/services/common.service';
import { Router, RouterModule } from '@angular/router';
import { Product } from '../../../shared/models/model';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-detail',
  imports: [CommonModule, RouterModule],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss',
})
export class ProductDetailComponent implements OnInit {
  product!: Product;
  relatedProducts: Product[] = [];
  loading = true;
  private commonService = inject(CommonService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  ngOnInit() {
    const slug = this.route.snapshot.paramMap.get('slug');
    if (slug) {
      this.loadProduct(slug);
    }
  }

  loadProduct(slug: string) {
    this.commonService.getProductBySlug(slug).subscribe({
      next: (product) => {
        this.product = product;
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  goBack() {
    this.router.navigate(['/product']);
  }
}
