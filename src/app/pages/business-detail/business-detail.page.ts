import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../core/services/language.service';
import { addIcons } from 'ionicons';
import {
  callOutline, checkmarkCircle, globeOutline,
  heartOutline, heart, locationOutline,
  logoInstagram, logoWhatsapp, sendOutline, shareOutline,
  star, starOutline, chatbubbleOutline, pricetagOutline,
  mailOutline, calendarOutline, imagesOutline,
  thumbsUpOutline, thumbsUp, flagOutline,
  chevronDownOutline, chevronUpOutline,
  chevronBackOutline, chevronForwardOutline,
  expandOutline, closeOutline, personOutline, ticketOutline,
  timeOutline, copyOutline, checkmarkOutline, storefrontOutline,
} from 'ionicons/icons';
import { BusinessDetails } from '../../features/business/models/business.model';
import { BusinessApiService } from '../../features/business/services/business-api.service';
import { FavoritesApiService } from '../../features/favorites/services/favorites-api.service';
import { ReferenceType } from '../../features/favorites/models/favorite.model';

import { ReviewsApiService } from '../../features/reviews/services/reviews-api.service';
import { ReviewReactionsApiService } from '../../features/reviews/services/review-reactions-api.service';
import { ReviewListItem } from '../../features/reviews/models/review.model';
import { DailyOffersApiService } from '../../features/daily-offers/services/daily-offers-api.service';
import { DailyOfferDetail, DailyOfferListItem } from '../../features/daily-offers/models/daily-offer.model';
import { EventDetail, EventListItem } from '../../features/events/models/event.model';
import { DealsApiService } from '../../features/deals/services/deals-api.service';
import { DealDetail, DealListItem } from '../../features/deals/models/deal.model';
import { EventsApiService } from '../../features/events/services/events-api.service';
import { ContactRequestsApiService } from '../../features/contact-requests/services/contact-requests-api.service';
import { AuthService } from '../../core/services/auth.service';
import { AppHeaderComponent } from '../../shared/components/app-header/app-header.component';
import { AppButtonComponent } from '../../shared/components/app-button/app-button.component';
import { UploadUrlPipe } from '../../shared/pipes/upload-url.pipe';

@Component({
  selector: 'app-business-detail',
  standalone: true,
  imports: [FormsModule, DatePipe, IonContent, IonIcon, TranslateModule, AppHeaderComponent, AppButtonComponent, UploadUrlPipe],
  templateUrl: './business-detail.page.html',
  styleUrls: ['./business-detail.page.scss'],
})
export class BusinessDetailPage implements OnInit {
  readonly lang = inject(LanguageService);
  private readonly translate = inject(TranslateService);

  business: BusinessDetails | null = null;
  isLoading = true;
  hasError = false;

  isFavorite = false;
  favoriteId: number | null = null;
  isFavoriteLoading = false;
  favoriteCount = 0;

  reviews: ReviewListItem[] = [];
  offers: DailyOfferListItem[] = [];
  events: EventListItem[] = [];
  deals: DealListItem[] = [];
  reviewsLoading = true;
  offersLoading = true;
  eventsLoading = true;
  dealsLoading = true;

  expandedOfferId: number | null = null;
  offerDetailMap = new Map<number, DailyOfferDetail>();
  offerDetailLoading = new Set<number>();

  expandedEventId: number | null = null;
  eventDetailMap = new Map<number, EventDetail>();
  eventDetailLoading = new Set<number>();

  expandedDealId: number | null = null;
  dealDetailMap = new Map<number, DealDetail>();
  dealDetailLoading = new Set<number>();

  lightboxIndex: number | null = null;

  get lightboxImages(): string[] {
    return this.business?.images?.map(i => i.imageUrl) ?? [];
  }

  openLightbox(index: number): void { this.lightboxIndex = index; }
  closeLightbox(): void { this.lightboxIndex = null; }

  lightboxPrev(): void {
    if (this.lightboxIndex === null) return;
    this.lightboxIndex = (this.lightboxIndex - 1 + this.lightboxImages.length) % this.lightboxImages.length;
  }

  lightboxNext(): void {
    if (this.lightboxIndex === null) return;
    this.lightboxIndex = (this.lightboxIndex + 1) % this.lightboxImages.length;
  }

  // Reactions: reviewId → reaction id (null means not liked)
  likedReviews = new Map<number, number>();
  reactionLoading = new Set<number>();

  showContactForm = false;
  contactName = '';
  contactEmail = '';
  contactPhone = '';
  contactMessage = '';
  contactSubmitting = false;
  contactSent = false;

  hasUserReviewed = false;

  readonly stars = [1, 2, 3, 4, 5];

  get coverImage() {
    return this.business?.images?.find((img) => img.isCover) ?? this.business?.images?.[0] ?? null;
  }

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly businessApi: BusinessApiService,
    private readonly favoritesApi: FavoritesApiService,
    private readonly reviewsApi: ReviewsApiService,
    private readonly reviewReactionsApi: ReviewReactionsApiService,
    private readonly offersApi: DailyOffersApiService,
    private readonly eventsApi: EventsApiService,
    private readonly dealsApi: DealsApiService,
    private readonly contactRequestsApi: ContactRequestsApiService,
    readonly auth: AuthService
  ) {
    addIcons({
      callOutline, globeOutline, locationOutline,
      logoInstagram, logoWhatsapp, sendOutline,
      checkmarkCircle, heartOutline, heart, shareOutline,
      star, starOutline, chatbubbleOutline, pricetagOutline,
      mailOutline, calendarOutline, imagesOutline,
      thumbsUpOutline, thumbsUp, flagOutline,
      chevronDownOutline, chevronUpOutline,
      chevronBackOutline, chevronForwardOutline,
      expandOutline, closeOutline, personOutline, ticketOutline,
      timeOutline, copyOutline, checkmarkOutline, storefrontOutline,
    });
  }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) { this.hasError = true; this.isLoading = false; return; }

    this.businessApi.getById(id).subscribe({
      next: (b) => {
        this.business = b;
        this.isLoading = false;
        this.loadFavoriteStatus(id);
        this.loadFavoriteCount(id);
        this.loadReviews(id);
        this.loadOffers(id);
        this.loadEvents(id);
        this.loadDeals(id);
      },
      error: () => { this.hasError = true; this.isLoading = false; },
    });
  }

  private loadFavoriteCount(businessId: number): void {
    this.favoritesApi.getCount(ReferenceType.Business, businessId).subscribe({
      next: (count) => { this.favoriteCount = count; },
      error: () => {},
    });
  }

  private loadFavoriteStatus(businessId: number): void {
    const user = this.auth.currentUser;
    if (!user) return;
    this.favoritesApi.getUserFavorites(user.userId).subscribe({
      next: (favorites) => {
        const match = favorites.find(
          (f) => f.referenceType === ReferenceType.Business && f.referenceId === businessId
        );
        if (match) { this.isFavorite = true; this.favoriteId = match.id; }
      },
      error: () => {},
    });
  }

  private loadReviews(businessId: number): void {
    this.reviewsLoading = true;
    this.reviewsApi.getByBusiness(businessId).subscribe({
      next: (reviews) => {
        this.reviews = reviews.filter(r => r.status === 'Approved');
        const userId = this.auth.currentUser?.userId;
        if (userId) {
          this.hasUserReviewed = this.reviews.some(r => r.appUserId === userId);
          this.loadUserReactions(userId);
        }
        this.reviewsLoading = false;
      },
      error: () => { this.reviewsLoading = false; },
    });
  }

  private loadUserReactions(userId: number): void {
    this.reviewReactionsApi.getUserReactions(userId).subscribe({
      next: (reactions) => {
        this.likedReviews.clear();
        reactions.filter(r => r.reactionType === 1).forEach(r => {
          this.likedReviews.set(r.reviewId, r.id);
        });
      },
      error: () => {},
    });
  }

  toggleLike(review: ReviewListItem): void {
    const user = this.auth.currentUser;
    if (!user || this.reactionLoading.has(review.id)) return;
    this.reactionLoading.add(review.id);

    const existingReactionId = this.likedReviews.get(review.id);
    if (existingReactionId !== undefined) {
      this.reviewReactionsApi.removeReaction(existingReactionId).subscribe({
        next: () => {
          this.likedReviews.delete(review.id);
          review.likeCount = Math.max(0, review.likeCount - 1);
          this.reactionLoading.delete(review.id);
        },
        error: () => { this.reactionLoading.delete(review.id); },
      });
    } else {
      this.reviewReactionsApi.addReaction({ reviewId: review.id, appUserId: user.userId, reactionType: 1 }).subscribe({
        next: (reaction) => {
          this.likedReviews.set(review.id, reaction.id);
          review.likeCount = review.likeCount + 1;
          this.reactionLoading.delete(review.id);
        },
        error: () => { this.reactionLoading.delete(review.id); },
      });
    }
  }

  isLiked(reviewId: number): boolean {
    return this.likedReviews.has(reviewId);
  }

  goToAddReview(): void {
    if (this.business) {
      this.router.navigate(['/add-review', this.business.id]);
    }
  }

  private loadOffers(businessId: number): void {
    this.offersLoading = true;
    this.offersApi.getActiveBusiness(businessId).subscribe({
      next: (offers) => {
        this.offers = offers.filter(o => o.isActive && o.isPublished);
        this.offersLoading = false;
      },
      error: () => { this.offersLoading = false; },
    });
  }

  private loadEvents(businessId: number): void {
    this.eventsLoading = true;
    this.eventsApi.getByBusiness(businessId).subscribe({
      next: (events) => {
        this.events = events.filter(e => e.isPublished);
        this.eventsLoading = false;
      },
      error: () => { this.eventsLoading = false; },
    });
  }

  toggleEvent(id: number): void {
    if (this.expandedEventId === id) { this.expandedEventId = null; return; }
    this.expandedEventId = id;
    if (this.eventDetailMap.has(id) || this.eventDetailLoading.has(id)) return;
    this.eventDetailLoading.add(id);
    this.eventsApi.getById(id).subscribe({
      next: (detail) => { this.eventDetailMap.set(id, detail); this.eventDetailLoading.delete(id); },
      error: () => { this.eventDetailLoading.delete(id); },
    });
  }

  private loadDeals(businessId: number): void {
    this.dealsLoading = true;
    this.dealsApi.getByBusiness(businessId).subscribe({
      next: (deals) => {
        this.deals = deals.filter(d => d.isPublished);
        this.dealsLoading = false;
      },
      error: () => { this.dealsLoading = false; },
    });
  }

  toggleDeal(id: number): void {
    if (this.expandedDealId === id) { this.expandedDealId = null; return; }
    this.expandedDealId = id;
    if (this.dealDetailMap.has(id) || this.dealDetailLoading.has(id)) return;
    this.dealDetailLoading.add(id);
    this.dealsApi.getById(id).subscribe({
      next: (detail) => { this.dealDetailMap.set(id, detail); this.dealDetailLoading.delete(id); },
      error: () => { this.dealDetailLoading.delete(id); },
    });
  }

  dealDiscountLabel(deal: DealListItem): string {
    return deal.discountType === 'Percentage'
      ? `${deal.discountValue}% off`
      : `${deal.discountValue} off`;
  }

  offerUrgency(offer: DailyOfferListItem): string | null {
    if (!offer.endsAtUtc) return null;
    const msLeft = new Date(offer.endsAtUtc).getTime() - Date.now();
    const hoursLeft = msLeft / (1000 * 60 * 60);
    if (hoursLeft <= 0) return null;
    if (hoursLeft <= 6) return this.translate.instant('BUSINESS_DETAIL.ENDS_FEW_HOURS');
    if (hoursLeft <= 24) return this.translate.instant('BUSINESS_DETAIL.ENDS_TODAY');
    if (hoursLeft <= 48) return this.translate.instant('BUSINESS_DETAIL.ENDS_TOMORROW');
    return null;
  }

  async copyCoupon(code: string, event: MouseEvent): Promise<void> {
    event.stopPropagation();
    try {
      await navigator.clipboard.writeText(code);
      this.copiedCode = code;
      setTimeout(() => { this.copiedCode = null; }, 2000);
    } catch {}
  }

  copiedCode: string | null = null;

  toggleOffer(id: number): void {
    if (this.expandedOfferId === id) { this.expandedOfferId = null; return; }
    this.expandedOfferId = id;
    if (this.offerDetailMap.has(id) || this.offerDetailLoading.has(id)) return;
    this.offerDetailLoading.add(id);
    this.offersApi.getById(id).subscribe({
      next: (detail) => { this.offerDetailMap.set(id, detail); this.offerDetailLoading.delete(id); },
      error: () => { this.offerDetailLoading.delete(id); },
    });
  }

  submitContact(): void {
    if (!this.business || !this.contactName || !this.contactEmail || this.contactSubmitting) return;
    this.contactSubmitting = true;
    this.contactRequestsApi.create({
      businessId: this.business.id,
      appUserId: this.auth.currentUser?.userId ?? null,
      name: this.contactName,
      email: this.contactEmail,
      phoneNumber: this.contactPhone || null,
      message: this.contactMessage || null,
      contactType: 'FormSubmit',
    }).subscribe({
      next: () => {
        this.contactSent = true;
        this.contactSubmitting = false;
        setTimeout(() => { this.showContactForm = false; this.resetContactForm(); }, 2000);
      },
      error: () => { this.contactSubmitting = false; },
    });
  }

  openContactForm(): void {
    const user = this.auth.currentUser;
    this.contactEmail = user?.email ?? '';
    this.contactName = user?.name ?? '';
    this.showContactForm = true;
  }

  resetContactForm(): void {
    this.contactName = '';
    this.contactEmail = '';
    this.contactPhone = '';
    this.contactMessage = '';
    this.contactSent = false;
  }

  toggleFavorite(): void {
    const user = this.auth.currentUser;
    if (!user || !this.business || this.isFavoriteLoading) return;
    this.isFavoriteLoading = true;
    if (this.isFavorite && this.favoriteId !== null) {
      this.favoritesApi.removeFavorite(this.favoriteId).subscribe({
        next: () => { this.isFavorite = false; this.favoriteId = null; this.favoriteCount = Math.max(0, this.favoriteCount - 1); this.isFavoriteLoading = false; },
        error: () => { this.isFavoriteLoading = false; },
      });
    } else {
      this.favoritesApi.addFavorite(user.userId, ReferenceType.Business, this.business.id).subscribe({
        next: (fav) => { this.isFavorite = true; this.favoriteId = fav.id; this.favoriteCount++; this.isFavoriteLoading = false; },
        error: () => { this.isFavoriteLoading = false; },
      });
    }
  }

  reportBusiness(): void {
    if (this.business) {
      this.router.navigate(['/report'], { queryParams: { type: 1, id: this.business.id } });
    }
  }

  async shareBusiness(): Promise<void> {
    if (!this.business) return;
    try {
      if (navigator.share) {
        await navigator.share({ title: this.business.name, url: window.location.href });
      } else {
        await navigator.clipboard.writeText(window.location.href);
      }
    } catch {}
  }

  call(): void { if (this.business?.phoneNumber) window.location.href = `tel:${this.business.phoneNumber}`; }
  openWebsite(): void { if (this.business?.website) window.open(this.business.website, '_blank'); }
  openWhatsApp(): void { if (this.business?.whatsAppNumber) window.open(`https://wa.me/${this.business.whatsAppNumber.replace(/\D/g, '')}`, '_blank'); }
  openInstagram(): void { if (this.business?.instagramUrl) window.open(this.business.instagramUrl, '_blank'); }
  openTelegram(): void { if (this.business?.telegramUrl) window.open(this.business.telegramUrl, '_blank'); }

  get fullAddress(): string {
    const b = this.business;
    if (!b) return '';
    const addressLine = this.lang.pick(b.addressLine, b.addressLineFa);
    const city = this.lang.pick(b.city, b.cityFa);
    const region = this.lang.pick(b.region, b.regionFa);
    return [addressLine, city, region, b.postalCode, b.country].filter(Boolean).join(', ');
  }

  get averageRating(): number {
    if (!this.reviews.length) return 0;
    return Math.round(this.reviews.reduce((sum, r) => sum + r.rating, 0) / this.reviews.length);
  }

  discountLabel(offer: DailyOfferListItem): string {
    return offer.discountType === 'Percentage'
      ? `${offer.discountValue}% off`
      : `${offer.discountValue} off`;
  }
}
