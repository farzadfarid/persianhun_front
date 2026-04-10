import { DatePipe } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Component, inject, OnInit } from '@angular/core';
import { LanguageService } from '../../core/services/language.service';

import { Router } from '@angular/router';

import { IonContent, IonIcon } from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';

import { addOutline, createOutline, trashOutline, ticketOutline, checkmarkCircle, closeCircle } from 'ionicons/icons';

import { forkJoin, of } from 'rxjs';

import { catchError } from 'rxjs/operators';

import { BusinessSearchItem } from '../../features/business/models/business.model';

import { BusinessApiService } from '../../features/business/services/business-api.service';

import { DealListItem } from '../../features/deals/models/deal.model';

import { DealsApiService } from '../../features/deals/services/deals-api.service';

import { AppHeaderComponent } from '../../shared/components/app-header/app-header.component';

interface DealRow extends DealListItem {
  businessName: string;
}

@Component({
  selector: 'app-my-deals',
  standalone: true,
  imports: [TranslateModule, DatePipe, IonContent, IonIcon, AppHeaderComponent],
  templateUrl: './my-deals.page.html',
  styleUrls: ['./my-deals.page.scss'],
})
export class MyDealsPage implements OnInit {
  readonly lang = inject(LanguageService);
  private readonly translate = inject(TranslateService);
  deals: DealRow[] = [];
  isLoading = true;
  hasError = false;

  constructor(
    private readonly businessApi: BusinessApiService,
    private readonly dealsApi: DealsApiService,
    private readonly router: Router,
  ) {
    addIcons({ addOutline, createOutline, trashOutline, ticketOutline, checkmarkCircle, closeCircle });
  }

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.isLoading = true;
    this.hasError = false;
    this.businessApi.getMyBusinesses().subscribe({
      next: (businesses) => {
        if (!businesses.length) { this.deals = []; this.isLoading = false; return; }
        const requests = businesses.map(b =>
          this.dealsApi.getByBusiness(b.id).pipe(catchError(() => of([] as DealListItem[])))
        );
        forkJoin(requests).subscribe({
          next: (results) => {
            this.deals = results.flatMap((items, i) =>
              items.map(d => ({ ...d, businessName: businesses[i].name }))
            );
            this.isLoading = false;
          },
          error: () => { this.hasError = true; this.isLoading = false; },
        });
      },
      error: () => { this.hasError = true; this.isLoading = false; },
    });
  }

  goCreate(): void { this.router.navigate(['/create-deal']); }
  goEdit(id: number): void { this.router.navigate(['/edit-deal', id]); }

  delete(deal: DealRow): void {
    this.dealsApi.delete(deal.id).subscribe({
      next: () => { this.deals = this.deals.filter(d => d.id !== deal.id); },
    });
  }

  togglePublish(deal: DealRow): void {
    const action = deal.isPublished ? this.dealsApi.unpublish(deal.id) : this.dealsApi.publish(deal.id);
    action.subscribe({ next: () => { deal.isPublished = !deal.isPublished; } });
  }

  discountLabel(deal: DealRow): string {
    const off = this.translate.instant('COMMON.OFF');
    return deal.discountType === 'Percentage' ? `${deal.discountValue}% ${off}` : `${deal.discountValue} ${off}`;
  }
}
