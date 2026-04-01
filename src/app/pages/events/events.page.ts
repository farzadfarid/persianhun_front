import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonContent, IonIcon, IonSkeletonText } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { calendarOutline, locationOutline, ticketOutline, settingsOutline } from 'ionicons/icons';
import { EventListItem } from '../../features/events/models/event.model';
import { EventsApiService } from '../../features/events/services/events-api.service';
import { BusinessApiService } from '../../features/business/services/business-api.service';
import { AuthService } from '../../core/services/auth.service';
import { AppHeaderComponent } from '../../shared/components/app-header/app-header.component';
import { UploadUrlPipe } from '../../shared/pipes/upload-url.pipe';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [IonContent, IonIcon, IonSkeletonText, DatePipe, RouterLink, AppHeaderComponent, UploadUrlPipe],
  templateUrl: './events.page.html',
  styleUrls: ['./events.page.scss'],
})
export class EventsPage implements OnInit {
  events: EventListItem[] = [];
  isLoading = true;
  hasError = false;
  myBusinessIds = new Set<number>();

  readonly skeletons = [1, 2, 3, 4];

  constructor(
    private readonly eventsApi: EventsApiService,
    private readonly businessApi: BusinessApiService,
    readonly auth: AuthService,
  ) {
    addIcons({ calendarOutline, locationOutline, ticketOutline, settingsOutline });
  }

  ngOnInit(): void {
    this.eventsApi.getPublished().subscribe({
      next: (items) => { this.events = items; this.isLoading = false; },
      error: () => { this.hasError = true; this.isLoading = false; },
    });

    if (this.auth.currentUser?.role === 'BusinessOwner') {
      this.businessApi.getMyBusinesses().subscribe({
        next: (businesses) => {
          this.myBusinessIds = new Set(businesses.map((b) => b.id));
        },
        error: () => {},
      });
    }
  }

  priceLabel(event: EventListItem): string {
    if (event.isFree) return 'Free';
    if (event.price) return `${event.price} ${event.currency ?? ''}`.trim();
    return '';
  }
}
