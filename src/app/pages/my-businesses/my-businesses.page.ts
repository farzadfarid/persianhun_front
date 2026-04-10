import { NgFor, NgIf } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  IonContent, IonFab, IonFabButton, IonIcon, IonSkeletonText,
} from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { addIcons } from 'ionicons';
import {
  add, businessOutline, cardOutline, createOutline,
  closeCircleOutline, eyeOutline, eyeOffOutline, banOutline,
  pricetagOutline, calendarOutline, peopleOutline, helpCircleOutline, heartOutline,
  chatbubbleOutline,
} from 'ionicons/icons';
import { catchError, forkJoin, of } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { LanguageService } from '../../core/services/language.service';
import { BusinessSearchItem } from '../../features/business/models/business.model';
import { BusinessApiService } from '../../features/business/services/business-api.service';
import { SubscriptionApiService } from '../../features/subscription/services/subscription-api.service';
import { SubscriptionDto, SubscriptionStatus } from '../../features/subscription/models/subscription.model';
import { FavoritesApiService } from '../../features/favorites/services/favorites-api.service';
import { ReferenceType } from '../../features/favorites/models/favorite.model';
import { AppHeaderComponent } from '../../shared/components/app-header/app-header.component';
import { UploadUrlPipe } from '../../shared/pipes/upload-url.pipe';

interface BizCard {
  biz: BusinessSearchItem;
  subscription: SubscriptionDto | null;
  isActive: boolean;
  cancelling: boolean;
  toggling: boolean;
  followerCount: number;
}

@Component({
  selector: 'app-my-businesses',
  standalone: true,
  imports: [
    IonContent, IonFab, IonFabButton, IonIcon, IonSkeletonText,
    NgIf, NgFor, RouterLink, TranslateModule, AppHeaderComponent, UploadUrlPipe,
  ],
  templateUrl: './my-businesses.page.html',
  styleUrls: ['./my-businesses.page.scss'],
})
export class MyBusinessesPage implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly businessApi = inject(BusinessApiService);
  private readonly subscriptionApi = inject(SubscriptionApiService);
  private readonly favoritesApi = inject(FavoritesApiService);
  private readonly router = inject(Router);
  readonly lang = inject(LanguageService);

  cards: BizCard[] = [];
  isLoading = true;
  hasError = false;
  activeHelp: { titleKey: string; descKey: string } | null = null;

  readonly SubscriptionStatus = SubscriptionStatus;
  readonly skeletons = [1, 2, 3];

  readonly helpTexts: Record<string, { titleKey: string; descKey: string }> = {
    edit:       { titleKey: 'MY_BUSINESSES.EDIT',       descKey: 'MY_BUSINESSES.HELP_EDIT' },
    offers:     { titleKey: 'MY_BUSINESSES.OFFERS',     descKey: 'MY_BUSINESSES.HELP_OFFERS' },
    events:     { titleKey: 'MY_BUSINESSES.EVENTS',     descKey: 'MY_BUSINESSES.HELP_EVENTS' },
    leads:      { titleKey: 'MY_BUSINESSES.LEADS',      descKey: 'MY_BUSINESSES.HELP_LEADS' },
    followers:  { titleKey: 'MY_BUSINESSES.FOLLOWERS',  descKey: 'MY_BUSINESSES.HELP_FOLLOWERS' },
    visibility: { titleKey: 'MY_BUSINESSES.VISIBILITY', descKey: 'MY_BUSINESSES.HELP_VISIBILITY' },
    cancel:     { titleKey: 'MY_BUSINESSES.CANCEL',     descKey: 'MY_BUSINESSES.HELP_CANCEL' },
    subscribe:  { titleKey: 'MY_BUSINESSES.SUBSCRIBE',  descKey: 'MY_BUSINESSES.HELP_SUBSCRIBE' },
    reviews:    { titleKey: 'MY_BUSINESSES.REVIEWS',    descKey: 'MY_BUSINESSES.HELP_REVIEWS' },
  };

  showHelp(key: string, event: Event): void {
    event.stopPropagation();
    this.activeHelp = this.helpTexts[key];
  }

  closeHelp(): void {
    this.activeHelp = null;
  }

  constructor() {
    addIcons({ add, businessOutline, cardOutline, createOutline, closeCircleOutline, eyeOutline, eyeOffOutline, banOutline, pricetagOutline, calendarOutline, peopleOutline, helpCircleOutline, heartOutline, chatbubbleOutline });
  }

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    if (!this.auth.currentUser) { this.isLoading = false; return; }

    this.businessApi.getMyBusinesses().subscribe({
      next: (items) => {
        if (!items.length) { this.cards = []; this.isLoading = false; return; }

        const subRequests = items.map(biz =>
          this.subscriptionApi.getActiveSubscription(biz.id).pipe(catchError(() => of(null)))
        );
        const countRequests = items.map(biz =>
          this.favoritesApi.getCount(ReferenceType.Business, biz.id).pipe(catchError(() => of(0)))
        );

        forkJoin([forkJoin(subRequests), forkJoin(countRequests)]).subscribe({
          next: ([subs, counts]) => {
            this.cards = items.map((biz, i) => ({
              biz, subscription: subs[i],
              isActive: (biz as any).isActive !== false,
              cancelling: false, toggling: false,
              followerCount: counts[i] as number,
            }));
            this.isLoading = false;
          },
          error: () => {
            this.cards = items.map(biz => ({ biz, subscription: null, isActive: true, cancelling: false, toggling: false, followerCount: 0 }));
            this.isLoading = false;
          },
        });
      },
      error: () => { this.hasError = true; this.isLoading = false; },
    });
  }

  subscribeForBusiness(businessId: number): void {
    this.router.navigate(['/plans'], { queryParams: { businessId } });
  }

  cancelSubscription(card: BizCard): void {
    if (!card.subscription || card.cancelling) return;
    card.cancelling = true;
    this.subscriptionApi.cancel(card.subscription.id).subscribe({
      next: () => { card.subscription = null; card.cancelling = false; },
      error: () => { card.cancelling = false; },
    });
  }

  toggleActive(card: BizCard): void {
    if (card.toggling) return;
    card.toggling = true;
    const newStatus = !card.isActive;
    this.businessApi.setStatus(card.biz.id, newStatus).subscribe({
      next: () => { card.isActive = newStatus; card.toggling = false; },
      error: () => { card.toggling = false; },
    });
  }

  hasActiveSub(card: BizCard): boolean {
    return card.subscription?.status === SubscriptionStatus.Active;
  }

  subLabel(card: BizCard): string {
    const s = card.subscription;
    if (!s) return '';
    if (s.status === SubscriptionStatus.Active) return s.planName ?? 'Active';
    return s.status;
  }
}
