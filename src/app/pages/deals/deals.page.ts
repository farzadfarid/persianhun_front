import { DatePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { IonContent, IonIcon, IonSearchbar, IonSkeletonText } from '@ionic/angular/standalone';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { addIcons } from 'ionicons';
import { ticketOutline, calendarOutline } from 'ionicons/icons';
import { DealListItem } from '../../features/deals/models/deal.model';
import { DealsApiService } from '../../features/deals/services/deals-api.service';
import { LanguageService } from '../../core/services/language.service';
import { AppButtonComponent } from '../../shared/components/app-button/app-button.component';
import { AppHeaderComponent } from '../../shared/components/app-header/app-header.component';
import { UploadUrlPipe } from '../../shared/pipes/upload-url.pipe';

@Component({
  selector: 'app-deals',
  standalone: true,
  imports: [
    FormsModule, DatePipe, RouterLink,
    IonContent, IonIcon, IonSkeletonText, IonSearchbar,
    TranslateModule,
    AppHeaderComponent, AppButtonComponent, UploadUrlPipe,
  ],
  templateUrl: './deals.page.html',
  styleUrls: ['./deals.page.scss'],
})
export class DealsPage implements OnInit {
  private readonly dealsApi = inject(DealsApiService);
  private readonly translate = inject(TranslateService);
  readonly lang = inject(LanguageService);

  allDeals: DealListItem[] = [];
  isLoading = true;
  hasError = false;
  keyword = '';

  readonly skeletons = [1, 2, 3, 4];

  constructor() {
    addIcons({ ticketOutline, calendarOutline });
  }

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.isLoading = true;
    this.hasError = false;
    this.dealsApi.getActive().subscribe({
      next: (items) => { this.allDeals = items; this.isLoading = false; },
      error: () => { this.hasError = true; this.isLoading = false; },
    });
  }

  get filteredDeals(): DealListItem[] {
    const kw = this.keyword.trim().toLowerCase();
    if (!kw) return this.allDeals;
    return this.allDeals.filter((d) =>
      d.title.toLowerCase().includes(kw) ||
      (d.titleFa && d.titleFa.toLowerCase().includes(kw))
    );
  }

  get emptyMessage(): string {
    return this.keyword
      ? this.translate.instant('DEALS.NO_MATCH')
      : this.translate.instant('DEALS.NO_DEALS');
  }

  retry(): void {
    this.load();
  }

  clearSearch(): void {
    this.keyword = '';
  }

  discountLabel(deal: DealListItem): string {
    return deal.discountType === 'Percentage'
      ? `${deal.discountValue}% off`
      : `${deal.discountValue} off`;
  }
}
