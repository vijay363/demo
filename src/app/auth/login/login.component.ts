import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
            error: () => this.router.navigate(['/product']),
          });
        },
        error: (err) => {
          this.error = err?.error?.message || 'Login failed';
        },
      });
  }
}
