import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonContent, IonIcon, IonSkeletonText } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { pricetagOutline, settingsOutline } from 'ionicons/icons';
import { DailyOfferDetail } from '../../features/daily-offers/models/daily-offer.model';
import { DailyOffersApiService } from '../../features/daily-offers/services/daily-offers-api.service';
import { BusinessApiService } from '../../features/business/services/business-api.service';
import { AuthService } from '../../core/services/auth.service';
import { AppHeaderComponent } from '../../shared/components/app-header/app-header.component';
import { UploadUrlPipe } from '../../shared/pipes/upload-url.pipe';

@Component({
  selector: 'app-offers',
  standalone: true,
  imports: [IonContent, IonIcon, IonSkeletonText, DatePipe, RouterLink, AppHeaderComponent, UploadUrlPipe],
  templateUrl: './offers.page.html',
  styleUrls: ['./offers.page.scss'],
})
export class OffersPage implements OnInit {
  offers: DailyOfferDetail[] = [];
  isLoading = true;
  hasError = false;
  myBusinessIds = new Set<number>();

  readonly skeletons = [1, 2, 3, 4];

  constructor(
    private readonly offersApi: DailyOffersApiService,
    private readonly businessApi: BusinessApiService,
    readonly auth: AuthService,
  ) {
    addIcons({ pricetagOutline, settingsOutline });
  }

  ngOnInit(): void {
    this.offersApi.getActive().subscribe({
      next: (items) => { this.offers = items; this.isLoading = false; },
      error: () => { this.hasError = true; this.isLoading = false; },
    });

    if (this.auth.currentUser?.role === 'BusinessOwner') {
      this.businessApi.getMyBusinesses().subscribe({
        next: (businesses) => {
          this.myBusinessIds = new Set(businesses.map((b) => b.id));
        },
        error: () => {},
      });
    }
  }

  discountLabel(offer: DailyOfferDetail): string {
    return offer.discountType === 'Percentage'
      ? `${offer.discountValue}% off`
      : `${offer.discountValue} off`;
  }
}
