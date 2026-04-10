import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../core/services/auth.service';
import { AppButtonComponent } from '../../shared/components/app-button/app-button.component';
import { AppInputComponent } from '../../shared/components/app-input/app-input.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, AppButtonComponent, AppInputComponent, TranslateModule],
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly translate = inject(TranslateService);

  loading = false;

  form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
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
    if (c.touched && c.hasError('minlength')) return this.translate.instant('AUTH.PASSWORD_MIN');
    return '';
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    const { email, password } = this.form.getRawValue();

    this.auth.register(email, password).subscribe({
      next: () => this.router.navigate(['/businesses']),
      error: () => (this.loading = false),
    });
  }
}
