import { DatePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { IonContent, IonIcon, IonSkeletonText } from '@ionic/angular/standalone';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { addIcons } from 'ionicons';
import { ticketOutline, calendarOutline, storefrontOutline, pricetagOutline } from 'ionicons/icons';
import { LanguageService } from '../../core/services/language.service';
import { DealDetail } from '../../features/deals/models/deal.model';
import { DealsApiService } from '../../features/deals/services/deals-api.service';
import { AppHeaderComponent } from '../../shared/components/app-header/app-header.component';
import { UploadUrlPipe } from '../../shared/pipes/upload-url.pipe';

@Component({
  selector: 'app-deal-details',
  standalone: true,
  imports: [IonContent, IonIcon, IonSkeletonText, DatePipe, RouterLink, AppHeaderComponent, UploadUrlPipe, TranslateModule],
  templateUrl: './deal-details.page.html',
  styleUrls: ['./deal-details.page.scss'],
})
export class DealDetailsPage implements OnInit {
  readonly lang = inject(LanguageService);
  private readonly translate = inject(TranslateService);
  deal: DealDetail | null = null;
  isLoading = true;
  hasError = false;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly dealsApi: DealsApiService,
  ) {
    addIcons({ ticketOutline, calendarOutline, storefrontOutline, pricetagOutline });
  }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) { this.hasError = true; this.isLoading = false; return; }

    this.dealsApi.getById(id).subscribe({
      next: (deal) => { this.deal = deal; this.isLoading = false; },
      error: () => { this.hasError = true; this.isLoading = false; },
    });
  }

  get discountLabel(): string {
    if (!this.deal) return '';
    const off = this.translate.instant('DEAL_DETAILS.OFF');
    return this.deal.discountType === 'Percentage'
      ? `${this.deal.discountValue}% ${off}`
      : `${this.deal.discountValue} ${this.deal.currency} ${off}`;
  }
}
