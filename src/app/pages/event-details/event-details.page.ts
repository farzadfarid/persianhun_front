import { DatePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { IonContent, IonIcon, IonSkeletonText } from '@ionic/angular/standalone';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { addIcons } from 'ionicons';
import { calendarOutline, locationOutline, ticketOutline, storefrontOutline, personOutline, callOutline, mailOutline } from 'ionicons/icons';
import { LanguageService } from '../../core/services/language.service';
import { EventDetail } from '../../features/events/models/event.model';
import { EventsApiService } from '../../features/events/services/events-api.service';
import { AppHeaderComponent } from '../../shared/components/app-header/app-header.component';
import { UploadUrlPipe } from '../../shared/pipes/upload-url.pipe';

@Component({
  selector: 'app-event-details',
  standalone: true,
  imports: [IonContent, IonIcon, IonSkeletonText, DatePipe, RouterLink, AppHeaderComponent, UploadUrlPipe, TranslateModule],
  templateUrl: './event-details.page.html',
  styleUrls: ['./event-details.page.scss'],
})
export class EventDetailsPage implements OnInit {
  readonly lang = inject(LanguageService);
  private readonly translate = inject(TranslateService);
  event: EventDetail | null = null;
  isLoading = true;
  hasError = false;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly eventsApi: EventsApiService,
  ) {
    addIcons({ calendarOutline, locationOutline, ticketOutline, storefrontOutline, personOutline, callOutline, mailOutline });
  }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) { this.hasError = true; this.isLoading = false; return; }

    this.eventsApi.getById(id).subscribe({
      next: (event) => { this.event = event; this.isLoading = false; },
      error: () => { this.hasError = true; this.isLoading = false; },
    });
  }

  get priceLabel(): string {
    if (!this.event) return '';
    if (this.event.isFree) return this.translate.instant('EVENT_DETAILS.FREE');
    if (this.event.price) return `${this.event.price} ${this.event.currency ?? ''}`.trim();
    return '';
  }

  get fullLocation(): string {
    if (!this.event) return '';
    return [
      this.lang.pick(this.event.locationName, this.event.locationNameFa),
      this.lang.pick(this.event.addressLine, null),
      this.lang.pick(this.event.city, this.event.cityFa),
      this.lang.pick(this.event.region, null),
    ].filter(Boolean).join(', ');
  }
}
