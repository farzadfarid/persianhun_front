import { DatePipe, SlicePipe } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Component, inject, OnInit } from '@angular/core';

import { FormsModule } from '@angular/forms';

import { IonContent, IonIcon } from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';

import {
  star, starOutline, chatbubbleOutline,
  checkmarkCircleOutline, closeCircleOutline, timeOutline, trashOutline,
} from 'ionicons/icons';

import { forkJoin, of } from 'rxjs';

import { catchError } from 'rxjs/operators';

import { BusinessApiService } from '../../features/business/services/business-api.service';

import { ReviewListItem } from '../../features/reviews/models/review.model';

import { ReviewsApiService } from '../../features/reviews/services/reviews-api.service';

import { AppHeaderComponent } from '../../shared/components/app-header/app-header.component';

interface ReviewRow extends ReviewListItem {
  businessName: string;
  actionLoading?: boolean;
}

@Component({
  selector: 'app-my-business-reviews',
  standalone: true,
  imports: [TranslateModule, FormsModule, DatePipe, SlicePipe, IonContent, IonIcon, AppHeaderComponent],
  templateUrl: './my-business-reviews.page.html',
  styleUrls: ['./my-business-reviews.page.scss'],
})
export class MyBusinessReviewsPage implements OnInit {
  private readonly translate = inject(TranslateService);
  reviews: ReviewRow[] = [];
  isLoading = true;
  hasError = false;

  businesses: { id: number; name: string }[] = [];
  selectedBusinessId: number | null = null;
  selectedStatus: string = 'all';

  readonly stars = [1, 2, 3, 4, 5];

  constructor(
    private readonly businessApi: BusinessApiService,
    private readonly reviewsApi: ReviewsApiService,
  ) {
    addIcons({ star, starOutline, chatbubbleOutline, checkmarkCircleOutline, closeCircleOutline, timeOutline, trashOutline });
  }

  ngOnInit(): void { this.load(); }

  load(): void {
    this.isLoading = true;
    this.hasError = false;
    this.businessApi.getMyBusinesses().subscribe({
      next: (businesses) => {
        this.businesses = businesses.map(b => ({ id: b.id, name: b.name }));
        if (!businesses.length) { this.reviews = []; this.isLoading = false; return; }
        const requests = businesses.map(b =>
          this.reviewsApi.getAllByBusiness(b.id).pipe(catchError(() => of([] as ReviewListItem[])))
        );
        forkJoin(requests).subscribe({
          next: (results) => {
            this.reviews = results.flatMap((items, i) =>
              items.map(r => ({ ...r, businessName: businesses[i].name }))
            ).sort((a, b) => new Date(b.createdAtUtc).getTime() - new Date(a.createdAtUtc).getTime());
            this.isLoading = false;
          },
          error: () => { this.hasError = true; this.isLoading = false; },
        });
      },
      error: () => { this.hasError = true; this.isLoading = false; },
    });
  }

  get filtered(): ReviewRow[] {
    return this.reviews.filter(r => {
      const bizMatch = !this.selectedBusinessId || r.businessId === this.selectedBusinessId;
      const statusMatch = this.selectedStatus === 'all' || r.status.toLowerCase() === this.selectedStatus;
      return bizMatch && statusMatch;
    });
  }

  get pendingCount(): number {
    return this.reviews.filter(r => {
      const bizMatch = !this.selectedBusinessId || r.businessId === this.selectedBusinessId;
      return bizMatch && r.status === 'Pending';
    }).length;
  }

  approve(review: ReviewRow): void {
    if (review.actionLoading) return;
    review.actionLoading = true;
    this.reviewsApi.approve(review.id).subscribe({
      next: () => { review.status = 'Approved'; review.actionLoading = false; },
      error: () => { review.actionLoading = false; },
    });
  }

  reject(review: ReviewRow): void {
    if (review.actionLoading) return;
    review.actionLoading = true;
    this.reviewsApi.reject(review.id).subscribe({
      next: () => { review.status = 'Rejected'; review.actionLoading = false; },
      error: () => { review.actionLoading = false; },
    });
  }

  confirmDeleteTarget: ReviewRow | null = null;

  confirmDelete(review: ReviewRow): void {
    this.confirmDeleteTarget = review;
  }

  cancelDelete(): void {
    this.confirmDeleteTarget = null;
  }

  executeDelete(): void {
    const review = this.confirmDeleteTarget;
    if (!review || review.actionLoading) return;
    this.confirmDeleteTarget = null;
    review.actionLoading = true;
    this.reviewsApi.delete(review.id).subscribe({
      next: () => { this.reviews = this.reviews.filter(r => r.id !== review.id); },
      error: () => { review.actionLoading = false; },
    });
  }

  statusLabel(status: string): string {
    switch (status) {
      case 'Approved': return this.translate.instant('MY_BUSINESS_REVIEWS.APPROVED');
      case 'Rejected': return this.translate.instant('MY_BUSINESS_REVIEWS.REJECTED');
      default: return this.translate.instant('MY_BUSINESS_REVIEWS.PENDING');
    }
  }
}
