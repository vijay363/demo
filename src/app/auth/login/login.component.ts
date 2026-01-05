import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../core/cache/services/toast.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  email = '';
  password = '';
  error: string | null = null;

  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private toast = inject(ToastService);
  showPassword: boolean = false;

  login(event: Event) {
    event.preventDefault();
    this.error = null;

    this.authService
      .login({ email: this.email, password: this.password })
      .subscribe({
        next: () => {
          this.authService.loadUserProfile().subscribe({
            next: (user) => {
              const returnUrl = this.route.snapshot.queryParams['returnUrl'];

              if (returnUrl) {
                this.router.navigateByUrl(returnUrl);
                return;
              }

              if (user.role === 'admin') {
                this.router.navigate(['/users']);
              } else {
                this.router.navigate(['/product']);
              }
            },
            error: () => {
              this.toast.warning('Logged in, but failed to load profile');
              this.router.navigate(['/product']);
            },
          });
        },
        error: (err) => {
          const message = err?.error?.message || 'Login failed';
          this.toast.error(message);
          this.error = message;
        },
      });
  }
}
