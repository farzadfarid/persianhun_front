import { DatePipe } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonContent, IonIcon, IonInfiniteScroll, IonInfiniteScrollContent, IonSearchbar, IonSkeletonText } from '@ionic/angular/standalone';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { addIcons } from 'ionicons';
import { pricetagOutline, settingsOutline } from 'ionicons/icons';
import { OfferSearchItem } from '../../features/daily-offers/models/daily-offer.model';
import { DailyOffersApiService } from '../../features/daily-offers/services/daily-offers-api.service';
import { BusinessApiService } from '../../features/business/services/business-api.service';
import { AuthService } from '../../core/services/auth.service';
import { LanguageService } from '../../core/services/language.service';
import { AppHeaderComponent } from '../../shared/components/app-header/app-header.component';
import { AppButtonComponent } from '../../shared/components/app-button/app-button.component';
import { UploadUrlPipe } from '../../shared/pipes/upload-url.pipe';

@Component({
  selector: 'app-offers',
  standalone: true,
  imports: [
    FormsModule, DatePipe,
    IonContent, IonIcon, IonSkeletonText, IonSearchbar,
    IonInfiniteScroll, IonInfiniteScrollContent,
    TranslateModule,
    AppHeaderComponent, AppButtonComponent, UploadUrlPipe,
  ],
  templateUrl: './offers.page.html',
  styleUrls: ['./offers.page.scss'],
})
export class OffersPage implements OnInit, OnDestroy {
  private readonly offersApi = inject(DailyOffersApiService);
  private readonly businessApi = inject(BusinessApiService);
  private readonly router = inject(Router);
  private readonly translate = inject(TranslateService);
  readonly auth = inject(AuthService);
  readonly lang = inject(LanguageService);

  offers: OfferSearchItem[] = [];
  totalCount = 0;
  isLoading = false;
  hasError = false;
  myBusinessIds = new Set<number>();

  keyword = '';
  city = '';

  private currentPage = 1;
  private readonly pageSize = 20;
  private readonly search$ = new Subject<void>();
  private sub?: Subscription;

  readonly skeletons = [1, 2, 3, 4];

  constructor() {
    addIcons({ pricetagOutline, settingsOutline });
  }

  ngOnInit(): void {
    this.sub = this.search$
      .pipe(debounceTime(350), distinctUntilChanged())
      .subscribe(() => this.loadFirstPage());

    this.loadFirstPage();

    if (this.auth.currentUser?.role === 'BusinessOwner') {
      this.businessApi.getMyBusinesses().subscribe({
        next: (businesses) => {
          this.myBusinessIds = new Set(businesses.map((b) => b.id));
        },
        error: () => {},
      });
    }
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  onSearchChange(): void {
    this.search$.next();
  }

  loadFirstPage(): void {
    this.currentPage = 1;
    this.offers = [];
    this.hasError = false;
    this.isLoading = true;

    this.offersApi.searchOffers({
      keyword: this.keyword || undefined,
      city: this.city || undefined,
      page: 1,
      pageSize: this.pageSize,
    }).subscribe({
      next: (result) => {
        this.offers = result.items;
        this.totalCount = result.totalCount;
        this.isLoading = false;
      },
      error: () => {
        this.hasError = true;
        this.isLoading = false;
      },
    });
  }

  loadMore(event: Event): void {
    this.currentPage++;
    this.offersApi.searchOffers({
      keyword: this.keyword || undefined,
      city: this.city || undefined,
      page: this.currentPage,
      pageSize: this.pageSize,
    }).subscribe({
      next: (result) => {
        this.offers = [...this.offers, ...result.items];
        this.totalCount = result.totalCount;
        (event as CustomEvent & { target: { complete: () => void } }).target.complete();
      },
      error: () => {
        (event as CustomEvent & { target: { complete: () => void } }).target.complete();
      },
    });
  }

  get hasMore(): boolean {
    return this.offers.length < this.totalCount;
  }

  get emptyMessage(): string {
    return this.keyword || this.city
      ? this.translate.instant('OFFERS.NO_MATCH')
      : this.translate.instant('OFFERS.NO_OFFERS');
  }

  clearFilters(): void {
    this.keyword = '';
    this.city = '';
    this.loadFirstPage();
  }

  retry(): void {
    this.loadFirstPage();
  }

  goToDetail(id: number): void {
    this.router.navigate(['/offers', id]);
  }

  goToManage(event: MouseEvent, businessId: number): void {
    event.stopPropagation();
    this.router.navigate(['/business-offers', businessId]);
  }

  discountLabel(offer: OfferSearchItem): string {
    if (offer.discountedPrice != null && offer.originalPrice != null) {
      const pct = Math.round((1 - offer.discountedPrice / offer.originalPrice) * 100);
      return `${pct}% off`;
    }
    return `${offer.discountValue} off`;
  }
}
