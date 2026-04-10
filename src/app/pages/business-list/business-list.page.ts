import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonContent, IonInfiniteScroll, IonInfiniteScrollContent, IonSearchbar } from '@ionic/angular/standalone';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { BusinessCardComponent } from '../../features/business/components/business-card/business-card.component';
import { BusinessEmptyStateComponent } from '../../features/business/components/business-empty-state/business-empty-state.component';
import { BusinessSearchItem } from '../../features/business/models/business.model';
import { BusinessApiService } from '../../features/business/services/business-api.service';
import { AppButtonComponent } from '../../shared/components/app-button/app-button.component';
import { AppHeaderComponent } from '../../shared/components/app-header/app-header.component';

@Component({
  selector: 'app-business-list',
  standalone: true,
  imports: [
    IonContent,
    IonSearchbar,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    FormsModule,
    TranslateModule,
    AppHeaderComponent,
    AppButtonComponent,
    BusinessCardComponent,
    BusinessEmptyStateComponent,
  ],
  templateUrl: './business-list.page.html',
  styleUrls: ['./business-list.page.scss'],
})
export class BusinessListPage implements OnInit, OnDestroy {
  private readonly businessApi = inject(BusinessApiService);
  private readonly translate = inject(TranslateService);

  businesses: BusinessSearchItem[] = [];
  totalCount = 0;
  isLoading = false;
  hasError = false;

  keyword = '';
  city = '';

  private currentPage = 1;
  private readonly pageSize = 20;
  private readonly search$ = new Subject<void>();
  private sub?: Subscription;

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

  loadFirstPage(): void {
    this.currentPage = 1;
    this.businesses = [];
    this.hasError = false;
    this.isLoading = true;

    this.businessApi
      .searchBusinesses({
        keyword: this.keyword || undefined,
        city: this.city || undefined,
        page: 1,
        pageSize: this.pageSize,
      })
      .subscribe({
        next: (result) => {
          this.businesses = result.items;
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
    this.businessApi
      .searchBusinesses({
        keyword: this.keyword || undefined,
        city: this.city || undefined,
        page: this.currentPage,
        pageSize: this.pageSize,
      })
      .subscribe({
        next: (result) => {
          this.businesses = [...this.businesses, ...result.items];
          this.totalCount = result.totalCount;
          (event as CustomEvent & { target: { complete: () => void } }).target.complete();
        },
        error: () => {
          (event as CustomEvent & { target: { complete: () => void } }).target.complete();
        },
      });
  }

  get hasMore(): boolean {
    return this.businesses.length < this.totalCount;
  }

  get emptyMessage(): string {
    return this.keyword || this.city
      ? this.translate.instant('BUSINESS_LIST.NO_MATCH')
      : this.translate.instant('BUSINESS_LIST.NO_BUSINESSES');
  }

  clearFilters(): void {
    this.keyword = '';
    this.city = '';
    this.loadFirstPage();
  }

  retry(): void {
    this.loadFirstPage();
  }
}
