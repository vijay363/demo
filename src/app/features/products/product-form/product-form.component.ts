import { Component, inject, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormArray,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../../../shared/services/common.service';
import { Category } from '../../../shared/models/model';

@Component({
  selector: 'app-product-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.scss',
})
export class ProductFormComponent implements OnInit {
  form!: FormGroup;
  isEdit = false;
  productId!: number;
  loading = false;

  categories: Category[] = [];
  toast = inject(ToastrService);

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private commonService: CommonService
  ) {}

  ngOnInit() {
    this.initForm();
    this.loadCategories();

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.productId = +id;
      this.loadProduct();
    }
  }

  initForm() {
    this.form = this.fb.group({
      title: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(1)]],
      description: ['', Validators.required],
      categoryId: [null, Validators.required],
      images: this.fb.array([]),
    });
  }

  get images() {
    return this.form.get('images') as FormArray;
  }

  addImage(url: string) {
    this.images.push(this.fb.control(url, Validators.required));
  }

  removeImage(index: number) {
    this.images.removeAt(index);
  }

  loadCategories() {
    this.commonService
      .getCategories()
      .subscribe((data) => (this.categories = data));
  }

  loadProduct() {
    this.commonService.getProductById(this.productId).subscribe((product) => {
      this.form.patchValue({
        title: product.title,
        price: product.price,
        description: product.description,
        categoryId: product.category.id,
      });

      product.images.forEach((img) => this.addImage(img));
    });
  }

  submit() {
    if (this.form.invalid) return;

    this.loading = true;

    const request$ = this.isEdit
      ? this.commonService.updateProduct(this.productId, this.form.value)
      : this.commonService.createProduct(this.form.value);

    request$.subscribe({
      next: () => {
        this.loading = false;
        this.commonService.clearCache();
        this.toast.success('Product saved successfully!', 'Success');
        this.router.navigate(['/product']);
      },
      error: () => {
        this.loading = false;
        this.toast.error('An error occurred. Please try again.', 'Error');
      },
    });
  }

  onFileSelect(event: any) {
    const file = event.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);

    this.commonService.uploadFile(formData).subscribe({
      next: (res: any) => {
        this.addImage(res.location);
        this.toast.success('Image uploaded successfully!', 'Success');
      },
      error: () => {
        this.toast.error('Failed to upload image.', 'Error');
      },
    });
  }
  goBack() {
    this.router.navigate(['/product']);
  }
}
