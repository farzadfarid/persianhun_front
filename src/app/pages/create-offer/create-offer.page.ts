import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonContent } from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { BusinessSearchItem } from '../../features/business/models/business.model';
import { BusinessApiService } from '../../features/business/services/business-api.service';
import { DailyOffersApiService } from '../../features/daily-offers/services/daily-offers-api.service';
import { AppHeaderComponent } from '../../shared/components/app-header/app-header.component';
import { AppButtonComponent } from '../../shared/components/app-button/app-button.component';

@Component({
  selector: 'app-create-offer',
  standalone: true,
  imports: [FormsModule, IonContent, AppHeaderComponent, AppButtonComponent, TranslateModule],
  templateUrl: './create-offer.page.html',
  styleUrls: ['./create-offer.page.scss'],
})
export class CreateOfferPage implements OnInit {
  businesses: BusinessSearchItem[] = [];
  businessesLoading = true;

  selectedBusinessId: number | null = null;
  title = '';
  titleFa = '';
  description = '';
  descriptionFa = '';
  discountType: 'Percentage' | 'FixedAmount' = 'Percentage';
  discountValue = 0;
  startsAt = '';
  endsAt = '';
  submitting = false;

  constructor(
    private readonly businessApi: BusinessApiService,
    private readonly offersApi: DailyOffersApiService,
    private readonly router: Router,
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
    if (!this.selectedBusinessId || !this.title || !this.discountValue || !this.startsAt || !this.endsAt || this.submitting) return;
    this.submitting = true;
    this.offersApi.create({
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
      startsAtUtc: new Date(this.startsAt).toISOString(),
      endsAtUtc: new Date(this.endsAt).toISOString(),
      coverImageUrl: null,
    }).subscribe({
      next: () => this.router.navigate(['/my-offers']),
      error: () => { this.submitting = false; },
    });
  }
}
