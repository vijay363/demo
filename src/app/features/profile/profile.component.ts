import { Component, inject } from '@angular/core';
import { AuthService } from '../../auth/services/auth.service';
import { HttpClient } from '@angular/common/http';
import { CommonService } from '../../shared/services/common.service';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-profile',
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
 private authService = inject(AuthService);
private http = inject(HttpClient);

  user?: any;

  constructor(private commonService: CommonService) {
   this.authService.currentUser$
      .pipe(takeUntilDestroyed())
      .subscribe(user => {
        this.user = user;
      });
  }
}
