import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { IonContent, IonIcon, IonTextarea } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  callOutline, checkmarkCircle, globeOutline,
  heartOutline, heart, locationOutline,
  logoInstagram, logoWhatsapp, sendOutline, shareOutline,
  star, starOutline, chatbubbleOutline, pricetagOutline,
  mailOutline, calendarOutline, imagesOutline,
} from 'ionicons/icons';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BusinessDetails } from '../../features/business/models/business.model';
import { BusinessApiService } from '../../features/business/services/business-api.service';
import { FavoritesApiService } from '../../features/favorites/services/favorites-api.service';
import { ReferenceType } from '../../features/favorites/models/favorite.model';
import { ReviewsApiService } from '../../features/reviews/services/reviews-api.service';
import { ReviewListItem } from '../../features/reviews/models/review.model';
import { DailyOffersApiService } from '../../features/daily-offers/services/daily-offers-api.service';
import { DailyOfferListItem } from '../../features/daily-offers/models/daily-offer.model';
import { EventListItem } from '../../features/events/models/event.model';
import { EventsApiService } from '../../features/events/services/events-api.service';
import { ContactRequestsApiService } from '../../features/contact-requests/services/contact-requests-api.service';
import { AuthService } from '../../core/services/auth.service';
import { AppHeaderComponent } from '../../shared/components/app-header/app-header.component';
import { AppButtonComponent } from '../../shared/components/app-button/app-button.component';
import { UploadUrlPipe } from '../../shared/pipes/upload-url.pipe';

@Component({
  selector: 'app-business-detail',
  standalone: true,
  imports: [FormsModule, DatePipe, IonContent, IonIcon, IonTextarea, AppHeaderComponent, AppButtonComponent, UploadUrlPipe],
  templateUrl: './business-detail.page.html',
  styleUrls: ['./business-detail.page.scss'],
})
export class BusinessDetailPage implements OnInit {
  business: BusinessDetails | null = null;
  isLoading = true;
  hasError = false;

  isFavorite = false;
  favoriteId: number | null = null;
  isFavoriteLoading = false;

  reviews: ReviewListItem[] = [];
  offers: DailyOfferListItem[] = [];
  events: EventListItem[] = [];
  reviewsLoading = true;
  offersLoading = true;
  eventsLoading = true;

  showContactForm = false;
  contactName = '';
  contactEmail = '';
  contactPhone = '';
  contactMessage = '';
  contactSubmitting = false;
  contactSent = false;

  showReviewForm = false;
  reviewRating = 0;
  reviewComment = '';
  reviewSubmitting = false;
  hasUserReviewed = false;

  readonly stars = [1, 2, 3, 4, 5];

  get coverImage() {
    return this.business?.images?.find((img) => img.isCover) ?? this.business?.images?.[0] ?? null;
  }

  constructor(
    private readonly route: ActivatedRoute,
    private readonly businessApi: BusinessApiService,
    private readonly favoritesApi: FavoritesApiService,
    private readonly reviewsApi: ReviewsApiService,
    private readonly offersApi: DailyOffersApiService,
    private readonly eventsApi: EventsApiService,
    private readonly contactRequestsApi: ContactRequestsApiService,
    readonly auth: AuthService
  ) {
    addIcons({
      callOutline, globeOutline, locationOutline,
      logoInstagram, logoWhatsapp, sendOutline,
      checkmarkCircle, heartOutline, heart, shareOutline,
      star, starOutline, chatbubbleOutline, pricetagOutline,
      mailOutline, calendarOutline, imagesOutline,
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
        this.loadReviews(id);
        this.loadOffers(id);
        this.loadEvents(id);
      },
      error: () => { this.hasError = true; this.isLoading = false; },
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
        this.reviews = reviews.filter(r => r.status === 'Active');
        const userId = this.auth.currentUser?.userId;
        if (userId) {
          this.hasUserReviewed = this.reviews.some(r => r.appUserId === userId);
        }
        this.reviewsLoading = false;
      },
      error: () => { this.reviewsLoading = false; },
    });
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

  resetContactForm(): void {
    this.contactName = '';
    this.contactEmail = '';
    this.contactPhone = '';
    this.contactMessage = '';
    this.contactSent = false;
  }

  setRating(rating: number): void {
    this.reviewRating = rating;
  }

  submitReview(): void {
    const user = this.auth.currentUser;
    if (!user || !this.business || this.reviewRating === 0 || this.reviewSubmitting) return;

    this.reviewSubmitting = true;
    this.reviewsApi.create({
      businessId: this.business.id,
      appUserId: user.userId,
      rating: this.reviewRating,
      title: null,
      comment: this.reviewComment || null,
    }).subscribe({
      next: () => {
        this.showReviewForm = false;
        this.hasUserReviewed = true;
        this.reviewSubmitting = false;
        this.loadReviews(this.business!.id);
      },
      error: () => { this.reviewSubmitting = false; },
    });
  }

  toggleFavorite(): void {
    const user = this.auth.currentUser;
    if (!user || !this.business || this.isFavoriteLoading) return;
    this.isFavoriteLoading = true;
    if (this.isFavorite && this.favoriteId !== null) {
      this.favoritesApi.removeFavorite(this.favoriteId).subscribe({
        next: () => { this.isFavorite = false; this.favoriteId = null; this.isFavoriteLoading = false; },
        error: () => { this.isFavoriteLoading = false; },
      });
    } else {
      this.favoritesApi.addFavorite(user.userId, ReferenceType.Business, this.business.id).subscribe({
        next: (fav) => { this.isFavorite = true; this.favoriteId = fav.id; this.isFavoriteLoading = false; },
        error: () => { this.isFavoriteLoading = false; },
      });
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
    return [b.addressLine, b.city, b.region, b.postalCode, b.country].filter(Boolean).join(', ');
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
