import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  IonContent, IonFab, IonFabButton, IonIcon, IonSkeletonText,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  add, businessOutline, cardOutline, createOutline,
  closeCircleOutline, eyeOutline, eyeOffOutline, banOutline,
  pricetagOutline, calendarOutline, peopleOutline,
} from 'ionicons/icons';
import { catchError, forkJoin, of } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { BusinessSearchItem } from '../../features/business/models/business.model';
import { BusinessApiService } from '../../features/business/services/business-api.service';
import { SubscriptionApiService } from '../../features/subscription/services/subscription-api.service';
import { SubscriptionDto, SubscriptionStatus } from '../../features/subscription/models/subscription.model';
import { AppHeaderComponent } from '../../shared/components/app-header/app-header.component';
import { UploadUrlPipe } from '../../shared/pipes/upload-url.pipe';

interface BizCard {
  biz: BusinessSearchItem;
  subscription: SubscriptionDto | null;
  isActive: boolean;
  cancelling: boolean;
  toggling: boolean;
}

@Component({
  selector: 'app-my-businesses',
  standalone: true,
  imports: [
    IonContent, IonFab, IonFabButton, IonIcon, IonSkeletonText,
    NgIf, NgFor, RouterLink, AppHeaderComponent, UploadUrlPipe,
  ],
  templateUrl: './my-businesses.page.html',
  styleUrls: ['./my-businesses.page.scss'],
})
export class MyBusinessesPage implements OnInit {
  cards: BizCard[] = [];
  isLoading = true;
  hasError = false;

  readonly SubscriptionStatus = SubscriptionStatus;
  readonly skeletons = [1, 2, 3];

  constructor(
    private readonly auth: AuthService,
    private readonly businessApi: BusinessApiService,
    private readonly subscriptionApi: SubscriptionApiService,
    private readonly router: Router,
  ) {
    addIcons({ add, businessOutline, cardOutline, createOutline, closeCircleOutline, eyeOutline, eyeOffOutline, banOutline, pricetagOutline, calendarOutline, peopleOutline });
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

        forkJoin(subRequests).subscribe({
          next: (subs) => {
            this.cards = items.map((biz, i) => ({
              biz,
              subscription: subs[i],
              isActive: (biz as any).isActive !== false,
              cancelling: false,
              toggling: false,
            }));
            this.isLoading = false;
          },
          error: () => {
            this.cards = items.map(biz => ({ biz, subscription: null, isActive: true, cancelling: false, toggling: false }));
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
