import { DatePipe } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Component, inject, OnInit } from '@angular/core';
import { LanguageService } from '../../core/services/language.service';

import { FormsModule } from '@angular/forms';

import { ActivatedRoute } from '@angular/router';

import { IonContent, IonIcon, IonToggle } from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';

import { addOutline, calendarOutline, createOutline, trashOutline } from 'ionicons/icons';

import { CreateEventRequest, EventListItem } from '../../features/events/models/event.model';

import { EventsApiService } from '../../features/events/services/events-api.service';

import { AppButtonComponent } from '../../shared/components/app-button/app-button.component';

import { AppHeaderComponent } from '../../shared/components/app-header/app-header.component';

import { ImageUploadComponent } from '../../shared/components/image-upload/image-upload.component';

import { UploadUrlPipe } from '../../shared/pipes/upload-url.pipe';

import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-business-events',
  standalone: true,
  imports: [TranslateModule, IonContent, IonIcon, IonToggle, FormsModule, DatePipe, AppHeaderComponent, AppButtonComponent, ImageUploadComponent, UploadUrlPipe],
  templateUrl: './business-events.page.html',
  styleUrls: ['./business-events.page.scss'],
})
export class BusinessEventsPage implements OnInit {
  readonly lang = inject(LanguageService);
  private readonly translate = inject(TranslateService);
  businessId = 0;
  events: EventListItem[] = [];
  isLoading = true;
  hasError = false;

  showForm = false;
  submitting = false;
  editingEvent: EventListItem | null = null;

  title = '';
  titleFa = '';
  description = '';
  descriptionFa = '';
  locationName = '';
  locationNameFa = '';
  city = '';
  cityFa = '';
  startsAt = '';
  endsAt = '';
  isFree = true;
  price: number | null = null;
  coverImageUrl: string | null = null;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly eventsApi: EventsApiService,
    private readonly auth: AuthService,
  ) {
    addIcons({ addOutline, calendarOutline, createOutline, trashOutline });
  }

  ngOnInit(): void {
    this.businessId = Number(this.route.snapshot.paramMap.get('businessId'));
    this.load();
  }

  load(): void {
    this.isLoading = true;
    this.eventsApi.getByBusiness(this.businessId).subscribe({
      next: (items) => { this.events = items; this.isLoading = false; },
      error: () => { this.hasError = true; this.isLoading = false; },
    });
  }

  togglePublish(event: EventListItem): void {
    const action = event.isPublished
      ? this.eventsApi.unpublish(event.id)
      : this.eventsApi.publish(event.id);
    action.subscribe({ next: () => { event.isPublished = !event.isPublished; } });
  }

  submitEvent(): void {
    if (!this.title || !this.startsAt || this.submitting) return;
    this.submitting = true;

    const request: CreateEventRequest = {
      title: this.title,
      titleFa: this.titleFa || null,
      slug: null,
      description: this.description || null,
      descriptionFa: this.descriptionFa || null,
      locationName: this.locationName || null,
      locationNameFa: this.locationNameFa || null,
      addressLine: null,
      addressLineFa: null,
      city: this.city || null,
      cityFa: this.cityFa || null,
      region: null,
      regionFa: null,
      postalCode: null,
      country: null,
      startsAtUtc: new Date(this.startsAt).toISOString(),
      endsAtUtc: this.endsAt ? new Date(this.endsAt).toISOString() : null,
      businessId: this.businessId,
      organizerName: null,
      organizerNameFa: null,
      organizerPhoneNumber: null,
      organizerEmail: null,
      coverImageUrl: this.coverImageUrl,
      isFree: this.isFree,
      price: this.isFree ? null : this.price,
      currency: this.isFree ? null : 'SEK',
      createdByUserId: this.auth.currentUser?.userId ?? null,
    };

    this.eventsApi.create(request).subscribe({
      next: () => {
        this.showForm = false;
        this.resetForm();
        this.submitting = false;
        this.load();
      },
      error: () => { this.submitting = false; },
    });
  }

  startEdit(event: EventListItem): void {
    this.editingEvent = event;
    this.eventsApi.getById(event.id).subscribe({
      next: (detail) => {
        this.title = detail.title;
        this.titleFa = detail.titleFa ?? '';
        this.description = detail.description ?? '';
        this.descriptionFa = detail.descriptionFa ?? '';
        this.locationName = detail.locationName ?? '';
        this.locationNameFa = detail.locationNameFa ?? '';
        this.city = detail.city ?? '';
        this.cityFa = detail.cityFa ?? '';
        this.startsAt = detail.startsAtUtc.slice(0, 16);
        this.endsAt = detail.endsAtUtc ? detail.endsAtUtc.slice(0, 16) : '';
        this.isFree = detail.isFree;
        this.price = detail.price;
        this.coverImageUrl = detail.coverImageUrl;
        this.showForm = true;
      },
    });
  }

  submitEdit(): void {
    if (!this.title || !this.startsAt || !this.editingEvent || this.submitting) return;
    this.submitting = true;

    this.eventsApi.update(this.editingEvent.id, {
      title: this.title,
      titleFa: this.titleFa || null,
      description: this.description || null,
      descriptionFa: this.descriptionFa || null,
      locationName: this.locationName || null,
      locationNameFa: this.locationNameFa || null,
      addressLine: null,
      addressLineFa: null,
      city: this.city || null,
      cityFa: this.cityFa || null,
      region: null,
      regionFa: null,
      postalCode: null,
      country: null,
      startsAtUtc: new Date(this.startsAt).toISOString(),
      endsAtUtc: this.endsAt ? new Date(this.endsAt).toISOString() : null,
      businessId: this.businessId,
      organizerName: null,
      organizerNameFa: null,
      organizerPhoneNumber: null,
      organizerEmail: null,
      coverImageUrl: this.coverImageUrl,
      isFree: this.isFree,
      price: this.isFree ? null : this.price,
      currency: this.isFree ? null : 'SEK',
    }).subscribe({
      next: () => {
        this.showForm = false;
        this.editingEvent = null;
        this.resetForm();
        this.submitting = false;
        this.load();
      },
      error: () => { this.submitting = false; },
    });
  }

  deleteEvent(event: EventListItem): void {
    this.eventsApi.delete(event.id).subscribe({
      next: () => { this.events = this.events.filter((e) => e.id !== event.id); },
    });
  }

  cancelForm(): void {
    this.showForm = false;
    this.editingEvent = null;
    this.resetForm();
  }

  private resetForm(): void {
    this.title = '';
    this.titleFa = '';
    this.description = '';
    this.descriptionFa = '';
    this.locationName = '';
    this.locationNameFa = '';
    this.city = '';
    this.cityFa = '';
    this.startsAt = '';
    this.endsAt = '';
    this.isFree = true;
    this.price = null;
    this.coverImageUrl = null;
  }

  priceLabel(event: EventListItem): string {
    if (event.isFree) return this.translate.instant('COMMON.FREE');
    if (event.price) return `${event.price} ${event.currency ?? ''}`.trim();
    return this.translate.instant('COMMON.PAID');
  }
}
