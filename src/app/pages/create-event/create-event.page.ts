import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonContent, IonToggle } from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { BusinessSearchItem } from '../../features/business/models/business.model';
import { BusinessApiService } from '../../features/business/services/business-api.service';
import { EventsApiService } from '../../features/events/services/events-api.service';
import { AppHeaderComponent } from '../../shared/components/app-header/app-header.component';
import { AppButtonComponent } from '../../shared/components/app-button/app-button.component';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-create-event',
  standalone: true,
  imports: [FormsModule, IonContent, IonToggle, AppHeaderComponent, AppButtonComponent, TranslateModule],
  templateUrl: './create-event.page.html',
  styleUrls: ['./create-event.page.scss'],
})
export class CreateEventPage implements OnInit {
  businesses: BusinessSearchItem[] = [];
  businessesLoading = true;

  selectedBusinessId: number | null = null;
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
  submitting = false;

  constructor(
    private readonly businessApi: BusinessApiService,
    private readonly eventsApi: EventsApiService,
    private readonly router: Router,
    private readonly auth: AuthService,
  ) {}

  ngOnInit(): void {
    this.businessApi.getMyBusinesses().subscribe({
      next: (items) => {
        this.businesses = items;
        if (items.length === 1) this.selectedBusinessId = items[0].id;
        this.businessesLoading = false;
      },
      error: () => { this.businessesLoading = false; },
    });
  }

  submit(): void {
    if (!this.selectedBusinessId || !this.title || !this.startsAt || this.submitting) return;
    this.submitting = true;
    this.eventsApi.create({
      title: this.title,
      titleFa: this.titleFa.trim() || null,
      slug: null,
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
      businessId: this.selectedBusinessId,
      organizerName: null,
      organizerNameFa: null,
      organizerPhoneNumber: null,
      organizerEmail: null,
      coverImageUrl: null,
      isFree: this.isFree,
      price: this.isFree ? null : this.price,
      currency: this.isFree ? null : 'SEK',
      createdByUserId: this.auth.currentUser?.userId ?? null,
    }).subscribe({
      next: () => this.router.navigate(['/my-events']),
      error: () => { this.submitting = false; },
    });
  }
}
