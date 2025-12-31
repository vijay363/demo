import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonService } from '../../shared/common.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.scss',
})
export class UserFormComponent implements OnInit {
  commonService = inject(CommonService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  fb = inject(FormBuilder);
  toastr = inject(ToastrService);
  userForm!: FormGroup;
  userId!: number | null;

  ngOnInit() {
    this.userId = this.route.snapshot.paramMap.get('id')
      ? Number(this.route.snapshot.paramMap.get('id'))
      : null;

    this.userForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      name: ['', Validators.required],
      password: ['', Validators.required],
      role: ['customer', Validators.required],
      avatar: ['', [Validators.required, Validators.pattern(/https?:\/\/.+/)]],
    });

    if (this.userId) {
      this.loadUser();
    }
  }

  loadUser() {
    this.commonService.getUserById(this.userId!).subscribe((user: any) => {
      this.userForm.patchValue(user);
    });
  }
  saveUser() {
    if (this.userForm.invalid) {
      this.toastr.error(
        'Please fill all fields correctly (avatar must be a URL)'
      );
      return;
    }

    if (this.userId) {
      this.commonService
        .updateUser(this.userId, this.userForm.value)
        .subscribe(() => {
          this.commonService.clearCache();
          this.toastr.success('User updated successfully!');
          this.router.navigate(['/users']);
        });
    } else {
      this.commonService.createUser(this.userForm.value).subscribe(() => {
        this.commonService.clearCache();
        this.toastr.success('User added successfully!');
        this.router.navigate(['/users']);
      });
    }
  }
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      return;
    }

    const file = input.files[0];
    const formData = new FormData();
    formData.append('file', file);

    this.commonService.uploadFile(formData).subscribe({
      next: (res: any) => {
        this.userForm.patchValue({
          avatar: res.location,
        });

        this.toastr.success('Avatar uploaded successfully!');
      },
      error: () => {
        this.toastr.error('File upload failed');
      },
    });
  }
}
