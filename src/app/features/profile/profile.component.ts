import { Component, inject } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { HttpClient } from '@angular/common/http';
import { CommonService } from '../../shared/common.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
  authService = inject(AuthService);
  user?: any;
  http = inject(HttpClient);

  constructor(private commonService: CommonService) {
    this.authService.getCurrentAuthUser().subscribe({
      next: (r) => {
        this.user = r;
      },
      error: (err) => {
        console.error('Failed to load profile', err);
      },
    });
  }
}
