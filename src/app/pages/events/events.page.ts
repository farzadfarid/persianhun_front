import { DatePipe } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonContent, IonIcon, IonInfiniteScroll, IonInfiniteScrollContent, IonSearchbar, IonSkeletonText } from '@ionic/angular/standalone';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { addIcons } from 'ionicons';
import { calendarOutline, locationOutline, ticketOutline } from 'ionicons/icons';
import { EventSearchItem } from '../../features/events/models/event.model';
import { EventsApiService } from '../../features/events/services/events-api.service';
import { LanguageService } from '../../core/services/language.service';
import { AppHeaderComponent } from '../../shared/components/app-header/app-header.component';
import { AppButtonComponent } from '../../shared/components/app-button/app-button.component';
import { UploadUrlPipe } from '../../shared/pipes/upload-url.pipe';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [
    FormsModule, DatePipe,
    IonContent, IonIcon, IonSkeletonText, IonSearchbar,
    IonInfiniteScroll, IonInfiniteScrollContent,
    TranslateModule,
    AppHeaderComponent, AppButtonComponent, UploadUrlPipe,
  ],
  templateUrl: './events.page.html',
  styleUrls: ['./events.page.scss'],
})
export class EventsPage implements OnInit, OnDestroy {
  private readonly eventsApi = inject(EventsApiService);
  private readonly router = inject(Router);
  private readonly translate = inject(TranslateService);
  readonly lang = inject(LanguageService);

  events: EventSearchItem[] = [];
  totalCount = 0;
  isLoading = false;
  hasError = false;

  keyword = '';
  city = '';
  isFreeOnly = false;

  private currentPage = 1;
  private readonly pageSize = 20;
  private readonly search$ = new Subject<void>();
  private sub?: Subscription;

  readonly skeletons = [1, 2, 3, 4];

  constructor() {
    addIcons({ calendarOutline, locationOutline, ticketOutline });
  }

  ngOnInit(): void {
    this.sub = this.search$
      .pipe(debounceTime(350), distinctUntilChanged())
      .subscribe(() => this.loadFirstPage());

    this.loadFirstPage();
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  onSearchChange(): void {
    this.search$.next();
  }

  toggleFree(): void {
    this.isFreeOnly = !this.isFreeOnly;
    this.loadFirstPage();
  }

  loadFirstPage(): void {
    this.currentPage = 1;
    this.events = [];
    this.hasError = false;
    this.isLoading = true;

    this.eventsApi.searchEvents({
      keyword: this.keyword || undefined,
      city: this.city || undefined,
      isFree: this.isFreeOnly || undefined,
      page: 1,
      pageSize: this.pageSize,
    }).subscribe({
      next: (result) => {
        this.events = result.items;
        this.totalCount = result.totalCount;
        this.isLoading = false;
      },
      error: () => {
        this.hasError = true;
        this.isLoading = false;
      },
    });
  }

  loadMore(event: Event): void {
    this.currentPage++;
    this.eventsApi.searchEvents({
      keyword: this.keyword || undefined,
      city: this.city || undefined,
      isFree: this.isFreeOnly || undefined,
      page: this.currentPage,
      pageSize: this.pageSize,
    }).subscribe({
      next: (result) => {
        this.events = [...this.events, ...result.items];
        this.totalCount = result.totalCount;
        (event as CustomEvent & { target: { complete: () => void } }).target.complete();
      },
      error: () => {
        (event as CustomEvent & { target: { complete: () => void } }).target.complete();
      },
    });
  }

  get hasMore(): boolean {
    return this.events.length < this.totalCount;
  }

  get emptyMessage(): string {
    return this.keyword || this.city || this.isFreeOnly
      ? this.translate.instant('EVENTS.NO_MATCH')
      : this.translate.instant('EVENTS.NO_EVENTS');
  }

  clearFilters(): void {
    this.keyword = '';
    this.city = '';
    this.isFreeOnly = false;
    this.loadFirstPage();
  }

  retry(): void {
    this.loadFirstPage();
  }

  goToDetail(id: number): void {
    this.router.navigate(['/events', id]);
  }

  priceLabel(event: EventSearchItem): string {
    if (event.isFree) return this.translate.instant('EVENTS.FREE');
    if (event.price) return `${event.price} ${event.currency ?? ''}`.trim();
    return '';
  }
}
