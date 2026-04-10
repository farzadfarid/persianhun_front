import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IonContent } from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { DealsApiService } from '../../features/deals/services/deals-api.service';
import { AppHeaderComponent } from '../../shared/components/app-header/app-header.component';
import { AppButtonComponent } from '../../shared/components/app-button/app-button.component';

@Component({
  selector: 'app-edit-deal',
  standalone: true,
  imports: [FormsModule, IonContent, AppHeaderComponent, AppButtonComponent, TranslateModule],
  templateUrl: './edit-deal.page.html',
  styleUrls: ['./edit-deal.page.scss'],
})
export class EditDealPage implements OnInit {
  dealId = 0;
  isLoading = true;
  hasError = false;
  submitting = false;

  title = '';
  titleFa = '';
  description = '';
  descriptionFa = '';
  discountType: 'Percentage' | 'FixedAmount' = 'Percentage';
  discountValue = 0;
  couponCode = '';
  validFrom = '';
  validTo = '';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly dealsApi: DealsApiService,
  ) {}

  ngOnInit(): void {
    this.dealId = Number(this.route.snapshot.paramMap.get('id'));
    this.dealsApi.getById(this.dealId).subscribe({
      next: (deal) => {
        this.title = deal.title;
        this.titleFa = deal.titleFa ?? '';
        this.description = deal.description ?? '';
        this.descriptionFa = deal.descriptionFa ?? '';
        this.discountType = deal.discountType as 'Percentage' | 'FixedAmount';
        this.discountValue = deal.discountValue;
        this.couponCode = deal.couponCode ?? '';
        this.validFrom = deal.validFromUtc ? deal.validFromUtc.slice(0, 16) : '';
        this.validTo = deal.validToUtc ? deal.validToUtc.slice(0, 16) : '';
        this.isLoading = false;
      },
      error: () => { this.hasError = true; this.isLoading = false; },
    });
  }

  submit(): void {
    if (!this.title || !this.discountValue || this.submitting) return;
    this.submitting = true;
    this.dealsApi.update(this.dealId, {
      title: this.title,
      titleFa: this.titleFa.trim() || null,
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
