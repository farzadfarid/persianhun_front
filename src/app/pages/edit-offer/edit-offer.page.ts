import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IonContent } from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { DailyOffersApiService } from '../../features/daily-offers/services/daily-offers-api.service';
import { AppHeaderComponent } from '../../shared/components/app-header/app-header.component';
import { AppButtonComponent } from '../../shared/components/app-button/app-button.component';

@Component({
  selector: 'app-edit-offer',
  standalone: true,
  imports: [FormsModule, IonContent, AppHeaderComponent, AppButtonComponent, TranslateModule],
  templateUrl: './edit-offer.page.html',
  styleUrls: ['./edit-offer.page.scss'],
})
export class EditOfferPage implements OnInit {
  offerId = 0;
  isLoading = true;
  hasError = false;
  submitting = false;

  title = '';
  titleFa = '';
  description = '';
  descriptionFa = '';
  discountType: 'Percentage' | 'FixedAmount' = 'Percentage';
  discountValue = 0;
  startsAt = '';
  endsAt = '';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly offersApi: DailyOffersApiService,
  ) {}

  ngOnInit(): void {
    this.offerId = Number(this.route.snapshot.paramMap.get('id'));
    this.offersApi.getById(this.offerId).subscribe({
      next: (offer) => {
        this.title = offer.title;
        this.titleFa = offer.titleFa ?? '';
        this.description = offer.description ?? '';
        this.descriptionFa = offer.descriptionFa ?? '';
        this.discountType = offer.discountType as 'Percentage' | 'FixedAmount';
        this.discountValue = offer.discountValue;
        this.startsAt = offer.startsAtUtc.slice(0, 16);
        this.endsAt = offer.endsAtUtc.slice(0, 16);
        this.isLoading = false;
      },
      error: () => { this.hasError = true; this.isLoading = false; },
    });
  }

  submit(): void {
    if (!this.title || !this.discountValue || !this.startsAt || !this.endsAt || this.submitting) return;
    this.submitting = true;
    this.offersApi.update(this.offerId, {
      title: this.title,
      titleFa: this.titleFa.trim() || null,
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
