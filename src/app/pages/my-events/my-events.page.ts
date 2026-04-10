import { DatePipe } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Component, inject, OnInit } from '@angular/core';
import { LanguageService } from '../../core/services/language.service';

import { Router } from '@angular/router';

import { IonContent, IonIcon } from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';

import { addOutline, createOutline, trashOutline, calendarOutline } from 'ionicons/icons';

import { forkJoin, of } from 'rxjs';

import { catchError } from 'rxjs/operators';

import { BusinessApiService } from '../../features/business/services/business-api.service';

import { EventListItem } from '../../features/events/models/event.model';

import { EventsApiService } from '../../features/events/services/events-api.service';

import { AppHeaderComponent } from '../../shared/components/app-header/app-header.component';

interface EventRow extends EventListItem {
  businessName: string;
}

@Component({
  selector: 'app-my-events',
  standalone: true,
  imports: [TranslateModule, DatePipe, IonContent, IonIcon, AppHeaderComponent],
  templateUrl: './my-events.page.html',
  styleUrls: ['./my-events.page.scss'],
})
export class MyEventsPage implements OnInit {
  readonly lang = inject(LanguageService);
  private readonly translate = inject(TranslateService);
  events: EventRow[] = [];
  isLoading = true;
  hasError = false;

  constructor(
    private readonly businessApi: BusinessApiService,
    private readonly eventsApi: EventsApiService,
    private readonly router: Router,
  ) {
    addIcons({ addOutline, createOutline, trashOutline, calendarOutline });
  }

  ngOnInit(): void { this.load(); }

  load(): void {
    this.isLoading = true;
    this.hasError = false;
    this.businessApi.getMyBusinesses().subscribe({
      next: (businesses) => {
        if (!businesses.length) { this.events = []; this.isLoading = false; return; }
        const requests = businesses.map(b =>
          this.eventsApi.getByBusiness(b.id).pipe(catchError(() => of([] as EventListItem[])))
        );
        forkJoin(requests).subscribe({
          next: (results) => {
            this.events = results.flatMap((items, i) =>
              items.map(e => ({ ...e, businessName: businesses[i].name }))
            );
            this.isLoading = false;
          },
          error: () => { this.hasError = true; this.isLoading = false; },
        });
      },
      error: () => { this.hasError = true; this.isLoading = false; },
    });
  }

  goCreate(): void { this.router.navigate(['/create-event']); }
  goEdit(id: number): void { this.router.navigate(['/edit-event', id]); }

  delete(event: EventRow): void {
    this.eventsApi.delete(event.id).subscribe({
      next: () => { this.events = this.events.filter(e => e.id !== event.id); },
    });
  }

  togglePublish(event: EventRow): void {
    const action = event.isPublished ? this.eventsApi.unpublish(event.id) : this.eventsApi.publish(event.id);
    action.subscribe({ next: () => { event.isPublished = !event.isPublished; } });
  }

  priceLabel(event: EventRow): string {
    if (event.isFree) return this.translate.instant('COMMON.FREE');
    if (event.price) return `${event.price} ${event.currency ?? ''}`.trim();
    return this.translate.instant('COMMON.PAID');
  }
}
