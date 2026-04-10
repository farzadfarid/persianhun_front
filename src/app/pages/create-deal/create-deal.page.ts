import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonContent } from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { BusinessSearchItem } from '../../features/business/models/business.model';
import { BusinessApiService } from '../../features/business/services/business-api.service';
import { DealsApiService } from '../../features/deals/services/deals-api.service';
import { AppHeaderComponent } from '../../shared/components/app-header/app-header.component';
import { AppButtonComponent } from '../../shared/components/app-button/app-button.component';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-create-deal',
  standalone: true,
  imports: [FormsModule, IonContent, AppHeaderComponent, AppButtonComponent, TranslateModule],
  templateUrl: './create-deal.page.html',
  styleUrls: ['./create-deal.page.scss'],
})
export class CreateDealPage implements OnInit {
  businesses: BusinessSearchItem[] = [];
  businessesLoading = true;

  selectedBusinessId: number | null = null;
  title = '';
  titleFa = '';
  description = '';
  descriptionFa = '';
  discountType: 'Percentage' | 'FixedAmount' = 'Percentage';
  discountValue = 0;
  couponCode = '';
  validFrom = '';
  validTo = '';
  submitting = false;

  constructor(
    private readonly businessApi: BusinessApiService,
    private readonly dealsApi: DealsApiService,
    private readonly router: Router,
    private readonly auth: AuthService,
  ) {}

  ngOnInit(): void {
    this.businessApi.getMyBusinesses().subscribe({
      next: (items) => {
        this.businesses = items;
        if (items.length === 1) this.selectedBusinessId = items[0].id;
        this.businessesLoading = false;
      },
      error: () => { this.businessesLoading = false; },
    });
  }

  submit(): void {
    if (!this.selectedBusinessId || !this.title || !this.discountValue || this.submitting) return;
    this.submitting = true;
    this.dealsApi.create({
      businessId: this.selectedBusinessId,
      title: this.title,
      titleFa: this.titleFa.trim() || null,
      slug: null,
      description: this.description.trim() || null,
      descriptionFa: this.descriptionFa.trim() || null,
      discountType: this.discountType,
      discountValue: this.discountValue,
      originalPrice: null,
      discountedPrice: null,
      currency: 'SEK',
      validFromUtc: this.validFrom ? new Date(this.validFrom).toISOString() : null,
      validToUtc: this.validTo ? new Date(this.validTo).toISOString() : null,
      couponCode: this.couponCode.trim() || null,
      termsAndConditions: null,
      termsAndConditionsFa: null,
      coverImageUrl: null,
    }).subscribe({
      next: () => this.router.navigate(['/my-deals']),
      error: () => { this.submitting = false; },
    });
  }
}
