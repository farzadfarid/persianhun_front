import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { IonContent, IonIcon, IonToggle } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { addOutline, pricetagOutline, trashOutline, createOutline } from 'ionicons/icons';
import { ToastService } from '../../core/services/toast.service';
import { CreateDailyOfferRequest, DailyOfferListItem } from '../../features/daily-offers/models/daily-offer.model';
import { DailyOffersApiService } from '../../features/daily-offers/services/daily-offers-api.service';
import { AppButtonComponent } from '../../shared/components/app-button/app-button.component';
import { AppHeaderComponent } from '../../shared/components/app-header/app-header.component';
import { ImageUploadComponent } from '../../shared/components/image-upload/image-upload.component';
import { UploadUrlPipe } from '../../shared/pipes/upload-url.pipe';

@Component({
  selector: 'app-business-offers',
  standalone: true,
  imports: [IonContent, IonIcon, IonToggle, FormsModule, DatePipe, AppHeaderComponent, AppButtonComponent, ImageUploadComponent, UploadUrlPipe],
  templateUrl: './business-offers.page.html',
  styleUrls: ['./business-offers.page.scss'],
})
export class BusinessOffersPage implements OnInit {
  businessId = 0;
  offers: DailyOfferListItem[] = [];
  isLoading = true;
  hasError = false;

  showForm = false;
  submitting = false;
  editingOffer: DailyOfferListItem | null = null;

  title = '';
  description = '';
  discountType: 'Percentage' | 'Fixed' = 'Percentage';
  discountValue = 0;
  startsAt = '';
  endsAt = '';
  coverImageUrl: string | null = null;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly offersApi: DailyOffersApiService,
    private readonly toast: ToastService,
  ) {
    addIcons({ addOutline, pricetagOutline, trashOutline, createOutline });
  }

  ngOnInit(): void {
    this.businessId = Number(this.route.snapshot.paramMap.get('businessId'));
    this.load();
  }

  load(): void {
    this.isLoading = true;
    this.offersApi.getActiveBusiness(this.businessId).subscribe({
      next: (items) => { this.offers = items; this.isLoading = false; },
      error: () => { this.hasError = true; this.isLoading = false; },
    });
  }

  togglePublish(offer: DailyOfferListItem): void {
    const action = offer.isPublished
      ? this.offersApi.unpublish(offer.id)
      : this.offersApi.publish(offer.id);
    action.subscribe({ next: () => { offer.isPublished = !offer.isPublished; } });
  }

  toggleActive(offer: DailyOfferListItem): void {
    const action = offer.isActive
      ? this.offersApi.deactivate(offer.id)
      : this.offersApi.activate(offer.id);
    action.subscribe({ next: () => { offer.isActive = !offer.isActive; } });
  }

  submitOffer(): void {
    if (!this.title || !this.discountValue || !this.startsAt || !this.endsAt || this.submitting) return;
    this.submitting = true;

    const request: CreateDailyOfferRequest = {
      businessId: this.businessId,
      title: this.title,
      slug: null,
      description: this.description || null,
      discountType: this.discountType,
      discountValue: this.discountValue,
      originalPrice: null,
      discountedPrice: null,
      currency: 'SEK',
      startsAtUtc: new Date(this.startsAt).toISOString(),
      endsAtUtc: new Date(this.endsAt).toISOString(),
      coverImageUrl: this.coverImageUrl,
    };

    this.offersApi.create(request).subscribe({
      next: () => {
        this.showForm = false;
        this.resetForm();
        this.submitting = false;
        this.load();
      },
      error: () => { this.submitting = false; },
    });
  }

  startEdit(offer: DailyOfferListItem): void {
    this.editingOffer = offer;
    this.offersApi.getById(offer.id).subscribe({
      next: (detail) => {
        this.title = detail.title;
        this.description = detail.description ?? '';
        this.discountType = detail.discountType as 'Percentage' | 'Fixed';
        this.discountValue = detail.discountValue;
        this.startsAt = detail.startsAtUtc.slice(0, 16);
        this.endsAt = detail.endsAtUtc.slice(0, 16);
        this.coverImageUrl = detail.coverImageUrl;
        this.showForm = true;
      },
    });
  }

  submitEdit(): void {
    if (!this.title || !this.discountValue || !this.startsAt || !this.endsAt || !this.editingOffer || this.submitting) return;
    this.submitting = true;

    this.offersApi.update(this.editingOffer.id, {
      title: this.title,
      description: this.description || null,
      discountType: this.discountType,
      discountValue: this.discountValue,
      originalPrice: null,
      discountedPrice: null,
      currency: 'SEK',
      startsAtUtc: new Date(this.startsAt).toISOString(),
      endsAtUtc: new Date(this.endsAt).toISOString(),
      coverImageUrl: this.coverImageUrl,
    }).subscribe({
      next: () => {
        this.showForm = false;
        this.editingOffer = null;
        this.resetForm();
        this.submitting = false;
        this.load();
        this.toast.success('Offer updated.');
      },
      error: () => { this.submitting = false; },
    });
  }

  deleteOffer(offer: DailyOfferListItem): void {
    this.offersApi.delete(offer.id).subscribe({
      next: () => {
        this.offers = this.offers.filter((o) => o.id !== offer.id);
        this.toast.success('Offer deleted.');
      },
    });
  }

  cancelForm(): void {
    this.showForm = false;
    this.editingOffer = null;
    this.resetForm();
  }

  private resetForm(): void {
    this.title = '';
    this.description = '';
    this.discountType = 'Percentage';
    this.discountValue = 0;
    this.startsAt = '';
    this.endsAt = '';
    this.coverImageUrl = null;
  }

  discountLabel(offer: DailyOfferListItem): string {
    return offer.discountType === 'Percentage'
      ? `${offer.discountValue}% off`
      : `${offer.discountValue} SEK off`;
  }
}
