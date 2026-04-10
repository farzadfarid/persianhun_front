import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IonContent, IonToggle } from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { EventsApiService } from '../../features/events/services/events-api.service';
import { AppHeaderComponent } from '../../shared/components/app-header/app-header.component';
import { AppButtonComponent } from '../../shared/components/app-button/app-button.component';

@Component({
  selector: 'app-edit-event',
  standalone: true,
  imports: [FormsModule, IonContent, IonToggle, AppHeaderComponent, AppButtonComponent, TranslateModule],
  templateUrl: './edit-event.page.html',
  styleUrls: ['./edit-event.page.scss'],
})
export class EditEventPage implements OnInit {
  eventId = 0;
  businessId: number | null = null;
  isLoading = true;
  hasError = false;
  submitting = false;

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

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly eventsApi: EventsApiService,
  ) {}

  ngOnInit(): void {
    this.eventId = Number(this.route.snapshot.paramMap.get('id'));
    this.eventsApi.getById(this.eventId).subscribe({
      next: (event) => {
        this.title = event.title;
        this.titleFa = event.titleFa ?? '';
        this.description = event.description ?? '';
        this.descriptionFa = event.descriptionFa ?? '';
        this.locationName = event.locationName ?? '';
        this.locationNameFa = event.locationNameFa ?? '';
        this.city = event.city ?? '';
        this.cityFa = event.cityFa ?? '';
        this.startsAt = event.startsAtUtc.slice(0, 16);
        this.endsAt = event.endsAtUtc ? event.endsAtUtc.slice(0, 16) : '';
        this.isFree = event.isFree;
        this.price = event.price;
        this.businessId = event.businessId;
        this.isLoading = false;
      },
      error: () => { this.hasError = true; this.isLoading = false; },
    });
  }

  submit(): void {
    if (!this.title || !this.startsAt || this.submitting) return;
    this.submitting = true;
    this.eventsApi.update(this.eventId, {
      title: this.title,
      titleFa: this.titleFa.trim() || null,
      description: this.description.trim() || null,
      descriptionFa: this.descriptionFa.trim() || null,
      locationName: this.locationName.trim() || null,
      locationNameFa: this.locationNameFa.trim() || null,
      addressLine: null,
      addressLineFa: null,
      city: this.city.trim() || null,
      cityFa: this.cityFa.trim() || null,
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
      coverImageUrl: null,
      isFree: this.isFree,
      price: this.isFree ? null : this.price,
      currency: this.isFree ? null : 'SEK',
    }).subscribe({
      next: () => this.router.navigate(['/my-events']),
      error: () => { this.submitting = false; },
    });
  }
}
