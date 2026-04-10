import { DatePipe } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Component, inject, OnInit } from '@angular/core';
import { LanguageService } from '../../core/services/language.service';

import { Router } from '@angular/router';

import { IonContent, IonIcon } from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';

import { addOutline, createOutline, trashOutline, pricetagOutline } from 'ionicons/icons';

import { forkJoin, of } from 'rxjs';

import { catchError } from 'rxjs/operators';

import { BusinessApiService } from '../../features/business/services/business-api.service';

import { DailyOfferListItem } from '../../features/daily-offers/models/daily-offer.model';

import { DailyOffersApiService } from '../../features/daily-offers/services/daily-offers-api.service';

import { AppHeaderComponent } from '../../shared/components/app-header/app-header.component';

interface OfferRow extends DailyOfferListItem {
  businessName: string;
}

@Component({
  selector: 'app-my-offers',
  standalone: true,
  imports: [TranslateModule, DatePipe, IonContent, IonIcon, AppHeaderComponent],
  templateUrl: './my-offers.page.html',
  styleUrls: ['./my-offers.page.scss'],
})
export class MyOffersPage implements OnInit {
  readonly lang = inject(LanguageService);
  private readonly translate = inject(TranslateService);
  offers: OfferRow[] = [];
  isLoading = true;
  hasError = false;

  constructor(
    private readonly businessApi: BusinessApiService,
    private readonly offersApi: DailyOffersApiService,
    private readonly router: Router,
  ) {
    addIcons({ addOutline, createOutline, trashOutline, pricetagOutline });
  }

  ngOnInit(): void { this.load(); }

  load(): void {
    this.isLoading = true;
    this.hasError = false;
    this.businessApi.getMyBusinesses().subscribe({
      next: (businesses) => {
        if (!businesses.length) { this.offers = []; this.isLoading = false; return; }
        const requests = businesses.map(b =>
          this.offersApi.getActiveBusiness(b.id).pipe(catchError(() => of([] as DailyOfferListItem[])))
        );
        forkJoin(requests).subscribe({
          next: (results) => {
            this.offers = results.flatMap((items, i) =>
              items.map(o => ({ ...o, businessName: businesses[i].name }))
            );
            this.isLoading = false;
          },
          error: () => { this.hasError = true; this.isLoading = false; },
        });
      },
      error: () => { this.hasError = true; this.isLoading = false; },
    });
  }

  goCreate(): void { this.router.navigate(['/create-offer']); }
  goEdit(id: number): void { this.router.navigate(['/edit-offer', id]); }

  delete(offer: OfferRow): void {
    this.offersApi.delete(offer.id).subscribe({
      next: () => { this.offers = this.offers.filter(o => o.id !== offer.id); },
    });
  }

  togglePublish(offer: OfferRow): void {
    const action = offer.isPublished ? this.offersApi.unpublish(offer.id) : this.offersApi.publish(offer.id);
    action.subscribe({ next: () => { offer.isPublished = !offer.isPublished; } });
  }

  discountLabel(offer: OfferRow): string {
    const off = this.translate.instant('COMMON.OFF');
    return offer.discountType === 'Percentage' ? `${offer.discountValue}% ${off}` : `${offer.discountValue} ${off}`;
  }
}
