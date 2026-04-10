import { DatePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { IonContent, IonIcon, IonSkeletonText } from '@ionic/angular/standalone';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { addIcons } from 'ionicons';
import { pricetagOutline, calendarOutline, storefrontOutline, flashOutline } from 'ionicons/icons';
import { LanguageService } from '../../core/services/language.service';
import { DailyOfferDetail } from '../../features/daily-offers/models/daily-offer.model';
import { DailyOffersApiService } from '../../features/daily-offers/services/daily-offers-api.service';
import { AppHeaderComponent } from '../../shared/components/app-header/app-header.component';
import { UploadUrlPipe } from '../../shared/pipes/upload-url.pipe';

@Component({
  selector: 'app-offer-details',
  standalone: true,
  imports: [IonContent, IonIcon, IonSkeletonText, DatePipe, RouterLink, AppHeaderComponent, UploadUrlPipe, TranslateModule],
  templateUrl: './offer-details.page.html',
  styleUrls: ['./offer-details.page.scss'],
})
export class OfferDetailsPage implements OnInit {
  readonly lang = inject(LanguageService);
  private readonly translate = inject(TranslateService);
  offer: DailyOfferDetail | null = null;
  isLoading = true;
  hasError = false;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly offersApi: DailyOffersApiService,
  ) {
    addIcons({ pricetagOutline, calendarOutline, storefrontOutline, flashOutline });
  }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) { this.hasError = true; this.isLoading = false; return; }

    this.offersApi.getById(id).subscribe({
      next: (offer) => { this.offer = offer; this.isLoading = false; },
      error: () => { this.hasError = true; this.isLoading = false; },
    });
  }

  get discountLabel(): string {
    if (!this.offer) return '';
    const off = this.translate.instant('OFFER_DETAILS.OFF');
    return this.offer.discountType === 'Percentage'
      ? `${this.offer.discountValue}% ${off}`
      : `${this.offer.discountValue} ${this.offer.currency} ${off}`;
  }
}
