import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonContent } from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../../core/services/auth.service';
import { BusinessSuggestionsApiService } from '../../features/business-suggestions/services/business-suggestions-api.service';
import { AppButtonComponent } from '../../shared/components/app-button/app-button.component';
import { AppHeaderComponent } from '../../shared/components/app-header/app-header.component';

@Component({
  selector: 'app-suggest-business',
  standalone: true,
  imports: [IonContent, FormsModule, TranslateModule, AppHeaderComponent, AppButtonComponent],
  templateUrl: './suggest-business.page.html',
  styleUrls: ['./suggest-business.page.scss'],
})
export class SuggestBusinessPage {
  private readonly auth = inject(AuthService);
  private readonly suggestionsApi = inject(BusinessSuggestionsApiService);
  private readonly router = inject(Router);

  businessName = '';
  categoryText = '';
  phoneNumber = '';
  city = '';
  description = '';

  submitting = false;
  submitted = false;
  error = '';

  submit(): void {
    if (!this.businessName || this.submitting) return;
    this.submitting = true;
    this.error = '';

    this.suggestionsApi.create({
      suggestedByUserId: this.auth.currentUser?.userId ?? null,
      businessName: this.businessName,
      categoryText: this.categoryText || null,
      phoneNumber: this.phoneNumber || null,
      email: null,
      website: null,
      addressLine: null,
      city: this.city || null,
      description: this.description || null,
    }).subscribe({
      next: () => {
        this.submitted = true;
        this.submitting = false;
        setTimeout(() => this.router.navigate(['/home']), 2000);
      },
      error: () => {
        this.error = 'Could not submit suggestion. Please try again.';
        this.submitting = false;
      },
    });
  }
}
