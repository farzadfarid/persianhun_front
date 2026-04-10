import { Component, inject, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { addIcons } from 'ionicons';
import { arrowForwardOutline, searchOutline } from 'ionicons/icons';
import { forkJoin } from 'rxjs';
import { BusinessCardComponent } from '../../features/business/components/business-card/business-card.component';
import { BusinessSearchItem } from '../../features/business/models/business.model';
import { BusinessApiService } from '../../features/business/services/business-api.service';
import { DealListItem } from '../../features/deals/models/deal.model';
import { DealsApiService } from '../../features/deals/services/deals-api.service';
import { OfferSearchItem } from '../../features/daily-offers/models/daily-offer.model';
import { DailyOffersApiService } from '../../features/daily-offers/services/daily-offers-api.service';
import { EventSearchItem } from '../../features/events/models/event.model';
import { EventsApiService } from '../../features/events/services/events-api.service';
import { AuthService } from '../../core/services/auth.service';
import { LanguageService } from '../../core/services/language.service';
import { AppHeaderComponent } from '../../shared/components/app-header/app-header.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    DatePipe, RouterLink,
    IonContent, IonIcon,
    TranslateModule,
    AppHeaderComponent, BusinessCardComponent,
  ],
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  private readonly businessApi = inject(BusinessApiService);
  private readonly dealsApi = inject(DealsApiService);
  private readonly offersApi = inject(DailyOffersApiService);
  private readonly eventsApi = inject(EventsApiService);
  readonly auth = inject(AuthService);
  readonly lang = inject(LanguageService);
  private readonly translate = inject(TranslateService);

  featuredBusinesses: BusinessSearchItem[] = [];
  latestDeals: DealListItem[] = [];
  latestOffers: OfferSearchItem[] = [];
  upcomingEvents: EventSearchItem[] = [];

  isLoading = true;

  constructor() {
    addIcons({ arrowForwardOutline, searchOutline });
  }

  ngOnInit(): void {
    forkJoin({
      businesses: this.businessApi.searchBusinesses({ page: 1, pageSize: 4 }),
      deals: this.dealsApi.getActive(),
      offers: this.offersApi.searchOffers({ page: 1, pageSize: 3 }),
      events: this.eventsApi.searchEvents({ page: 1, pageSize: 3 }),
    }).subscribe({
      next: ({ businesses, deals, offers, events }) => {
        this.featuredBusinesses = businesses.items;
        this.latestDeals = deals.slice(0, 3);
        this.latestOffers = offers.items;
        this.upcomingEvents = events.items;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  discountLabel(deal: DealListItem): string {
    return deal.discountType === 'Percentage'
      ? `${deal.discountValue}% off`
      : `${deal.discountValue} off`;
  }

  offerDiscountLabel(offer: OfferSearchItem): string {
    if (offer.discountedPrice != null && offer.originalPrice != null) {
      const pct = Math.round((1 - offer.discountedPrice / offer.originalPrice) * 100);
      return `${pct}% off`;
    }
    return `${offer.discountValue} off`;
  }

  priceLabel(event: EventSearchItem): string {
    if (event.isFree) return this.translate.instant('EVENTS.FREE');
    if (event.price) return `${event.price} ${event.currency ?? ''}`.trim();
    return '';
  }
}
