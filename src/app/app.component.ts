import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { AuthService } from './auth/services/auth.service';
import { ToastService } from './core/cache/services/toast.service';
import { GlobalLoaderComponent } from './core/cache/components/global-loader/global-loader.component';
import { ThemeMode, ThemeService } from './core/cache/services/theme.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, RouterModule,GlobalLoaderComponent,FormsModule,],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  authService = inject(AuthService);
  user$ = this.authService.currentUser$;
  private toast = inject(ToastService);
  theme = inject(ThemeService);

  themes = [
    { label: 'Light', value: 'light' },
    { label: 'Dark', value: 'dark' },
    { label: 'System', value: 'system' },
  ];

  selectedTheme = this.theme.getTheme();

  constructor(private router: Router) {}
  logout() {
    this.authService.logout();
    this.toast.info('Logged out successfully');
  }

  changeTheme(mode: ThemeMode) {
    this.theme.setTheme(mode);
  }
}
