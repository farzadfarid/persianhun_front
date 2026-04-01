import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { ApiService } from './api.service';
import { AuthResponse, AuthUser } from '../models/auth.model';

const TOKEN_KEY = 'access_token';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly api = inject(ApiService);
  private readonly router = inject(Router);

  private readonly currentUserSubject = new BehaviorSubject<AuthUser | null>(
    this.loadUserFromStorage()
  );

  readonly currentUser$: Observable<AuthUser | null> =
    this.currentUserSubject.asObservable();

  get currentUser(): AuthUser | null {
    return this.currentUserSubject.value;
  }

  get isAuthenticated(): boolean {
    return !!localStorage.getItem(TOKEN_KEY);
  }

  get token(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.api
      .post<AuthResponse>('/auth/login', { email, password })
      .pipe(tap((res) => this.storeSession(res)));
  }

  register(email: string, password: string): Observable<AuthResponse> {
    return this.api
      .post<AuthResponse>('/auth/register', { email, password })
      .pipe(tap((res) => this.storeSession(res)));
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    this.currentUserSubject.next(null);
    this.router.navigate(['/auth/login']);
  }

  private storeSession(res: AuthResponse): void {
    localStorage.setItem(TOKEN_KEY, res.token);
    this.currentUserSubject.next({
      userId: res.userId,
      email: res.email,
      role: res.role,
    });
  }

  private loadUserFromStorage(): AuthUser | null {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return null;

    try {
      // Decode payload to extract user info (no signature validation — server does that)
      const payload = JSON.parse(atob(token.split('.')[1]));
      return {
        userId: parseInt(payload['sub'], 10),
        email:
          payload['email'] ??
          payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] ??
          '',
        role:
          payload['role'] ??
          payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ??
          '',
      };
    } catch {
      localStorage.removeItem(TOKEN_KEY);
      return null;
    }
  }
}
