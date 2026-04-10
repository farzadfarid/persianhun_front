import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { IonIcon } from '@ionic/angular/standalone';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { addIcons } from 'ionicons';
import { alertCircleOutline } from 'ionicons/icons';
import { AuthService } from '../../core/services/auth.service';
import { AppButtonComponent } from '../../shared/components/app-button/app-button.component';
import { AppInputComponent } from '../../shared/components/app-input/app-input.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, NgIf, IonIcon, AppButtonComponent, AppInputComponent, TranslateModule],
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly translate = inject(TranslateService);

  loading = false;
  errorMessage = '';

  constructor() {
    addIcons({ alertCircleOutline });
  }

  form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  get emailError(): string {
    const c = this.form.controls.email;
    if (c.touched && c.hasError('required')) return this.translate.instant('AUTH.EMAIL_REQUIRED');
    if (c.touched && c.hasError('email')) return this.translate.instant('AUTH.EMAIL_INVALID');
    return '';
  }

  get passwordError(): string {
    const c = this.form.controls.password;
    if (c.touched && c.hasError('required')) return this.translate.instant('AUTH.PASSWORD_REQUIRED');
    return '';
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    const { email, password } = this.form.getRawValue();

    this.auth.login(email, password).subscribe({
      next: () => this.router.navigate(['/home']),
      error: (err: HttpErrorResponse) => {
        this.loading = false;
        this.errorMessage =
          err.error?.detail ??
          err.error?.title ??
          this.translate.instant('AUTH.UNEXPECTED_ERROR');
      },
    });
  }
}
