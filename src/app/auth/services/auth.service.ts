import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, take, tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { environment } from '../../../environments/environment';
import { CACHE_CONFIG } from '../../core/cache/cache/cache-config';

interface TokenResponse {
  access_token: string;
  refresh_token: string;
}

interface DecodedToken {
  sub?: string;
  email?: string;
  role?: string | string[];
  exp?: number;
  iat?: number;
  [key: string]: any;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly JWT_TOKEN = 'JWT_TOKEN';
  private API_URL = environment.apiUrl;
  private http = inject(HttpClient);
  private router = inject(Router);
  private refreshTimer: any = null;

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(
    this.isLoggedIn()
  );
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  private currentUserSubject = new BehaviorSubject<any>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    if (this.isLoggedIn()) {
      this.scheduleTokenRefresh();
    }
  }


  login(user: { email: string; password: string }): Observable<TokenResponse> {
    return this.http
      .post<TokenResponse>(`${this.API_URL}/auth/login`, user)
      .pipe(tap((tokens) => this.handleLoginSuccess(tokens)));
  }

  getCurrentAuthUser(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/auth/profile`);
  }

  refreshToken(): Observable<TokenResponse> | null {
    const stored = this.getStoredTokens();
    if (!stored?.refresh_token) {
      return null;
    }

    return this.http
      .post<TokenResponse>(`${environment.apiUrl}/auth/refresh-token`, {
        refresh_token: stored.refresh_token,
      })
      .pipe(tap((tokens) => this.handleLoginSuccess(tokens)));
  }

logout(): void {
  localStorage.removeItem(this.JWT_TOKEN);
  localStorage.removeItem(CACHE_CONFIG.storageKey);
  this.isAuthenticatedSubject.next(false);
  this.router.navigate(['/login']);
}


private handleLoginSuccess(tokens: TokenResponse): void {
  this.storeTokens(tokens);
  this.isAuthenticatedSubject.next(true);
  this.scheduleTokenRefresh(); 
}

private storeTokens(tokens: TokenResponse): void {
  localStorage.setItem(this.JWT_TOKEN, JSON.stringify(tokens));
}

private getStoredTokens(): TokenResponse | null {
  const raw = localStorage.getItem(this.JWT_TOKEN);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

  getAccessToken(): string | null {
    return this.getStoredTokens()?.access_token ?? null;
  }

  getRefreshTokenValue(): string | null {
    return this.getStoredTokens()?.refresh_token ?? null;
  }

  hasToken(): boolean {
    return !!this.getStoredTokens();
  }

  isLoggedIn(): boolean {
    const token = this.getAccessToken();
    if (!token) return false;
    return !this.isTokenExpired(token);
  }

  isTokenExpired(token: string): boolean {
    try {
      const decoded = jwtDecode<DecodedToken>(token);
      if (!decoded.exp) return true;
      const expirationDate = decoded.exp * 1000;
      const now = Date.now();
      return expirationDate < now;
    } catch {
      return true;
    }
  }

  getDecodedToken(): DecodedToken | null {
    const token = this.getAccessToken();
    if (!token) return null;
    try {
      return jwtDecode<DecodedToken>(token);
    } catch {
      return null;
    }
  }
  private scheduleTokenRefresh(): void {
    const token = this.getAccessToken();
    if (!token) return;

    const decoded = jwtDecode<{ exp: number }>(token);
    if (!decoded.exp) return;

    const expiresAt = decoded.exp * 1000;
    const now = Date.now();

    const refreshBeforeMs = 60 * 1000;
    const timeout = expiresAt - now - refreshBeforeMs;

    if (timeout <= 0) {
      this.refreshToken()?.pipe(take(1)).subscribe();
      return;
    }

    if (this.refreshTimer) clearTimeout(this.refreshTimer);

    this.refreshTimer = setTimeout(() => {
     this.refreshToken()?.pipe(take(1)).subscribe();
    }, timeout);

    console.log(` Auto-refresh scheduled in ${timeout / 1000}s`);
  }
  loadUserProfile(): Observable<any> {
    return this.getCurrentAuthUser().pipe(
      tap((user) => this.currentUserSubject.next(user))
    );
  }

  getCurrentUser() {
    return this.currentUserSubject.value;
  }
  hasRole(role: string): boolean {
    const user = this.currentUserSubject.value;
    return user?.role === role;
  }

  hasAnyRole(roles: string[]): boolean {
    const user = this.currentUserSubject.value;
    return roles.includes(user?.role);
  }
  initAuth(): Promise<void> {
    if (!this.hasToken()) {
      return Promise.resolve();
    }

    return new Promise((resolve) => {
      this.loadUserProfile().subscribe({
        next: () => resolve(),
        error: () => {
          this.logout();
          resolve();
        },
      });
    });
  }
}
