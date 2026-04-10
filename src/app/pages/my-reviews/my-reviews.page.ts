import { DatePipe } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { Component, OnInit } from '@angular/core';

import { RouterLink } from '@angular/router';

import { FormsModule } from '@angular/forms';

import { AlertController, IonContent, IonIcon, IonSkeletonText } from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';

import {
  starOutline, star, chatbubbleOutline,
  checkmarkCircleOutline, closeCircleOutline, timeOutline,
  trashOutline, businessOutline,
} from 'ionicons/icons';

import { forkJoin, of } from 'rxjs';

import { catchError } from 'rxjs/operators';

import { AuthService } from '../../core/services/auth.service';

import { BusinessApiService } from '../../features/business/services/business-api.service';

import { ReviewListItem } from '../../features/reviews/models/review.model';

import { ReviewsApiService } from '../../features/reviews/services/reviews-api.service';

import { AppHeaderComponent } from '../../shared/components/app-header/app-header.component';

interface ReviewRow extends ReviewListItem {
  businessName?: string;
  actionLoading?: boolean;
}

@Component({
  selector: 'app-my-reviews',
  standalone: true,
  imports: [TranslateModule, FormsModule, DatePipe, IonContent, IonIcon, IonSkeletonText, RouterLink, AppHeaderComponent],
  templateUrl: './my-reviews.page.html',
  styleUrls: ['./my-reviews.page.scss'],
})
export class MyReviewsPage implements OnInit {
  reviews: ReviewRow[] = [];
  isLoading = true;
  hasError = false;

  // owner-only
  businesses: { id: number; name: string }[] = [];
  selectedBusinessId: number | null = null;
  selectedStatus = 'all';

  readonly stars = [1, 2, 3, 4, 5];
  readonly skeletons = [1, 2, 3];

  get isOwner(): boolean {
    return this.auth.currentUser?.role === 'BusinessOwner';
  }

  constructor(
    readonly auth: AuthService,
    private readonly reviewsApi: ReviewsApiService,
    private readonly businessApi: BusinessApiService,
    private readonly alertCtrl: AlertController,
  ) {
    addIcons({ starOutline, star, chatbubbleOutline, checkmarkCircleOutline, closeCircleOutline, timeOutline, trashOutline, businessOutline });
  }

  ngOnInit(): void { this.load(); }

  load(): void {
    this.isLoading = true;
    this.hasError = false;
    if (this.isOwner) {
      this.loadOwnerReviews();
    } else {
      this.loadUserReviews();
    }
  }

  private loadUserReviews(): void {
    const user = this.auth.currentUser;
    if (!user) { this.isLoading = false; return; }
    this.reviewsApi.getByUser(user.userId).subscribe({
      next: (items) => { this.reviews = items; this.isLoading = false; },
      error: () => { this.hasError = true; this.isLoading = false; },
    });
  }

  private loadOwnerReviews(): void {
    this.businessApi.getMyBusinesses().subscribe({
      next: (businesses) => {
        this.businesses = businesses.map(b => ({ id: b.id, name: b.name }));
        if (!businesses.length) { this.reviews = []; this.isLoading = false; return; }
        const requests = businesses.map(b =>
          this.reviewsApi.getAllByBusiness(b.id).pipe(catchError(() => of([] as ReviewListItem[])))
        );
        forkJoin(requests).subscribe({
          next: (results) => {
            this.reviews = results
              .flatMap((items, i) => items.map(r => ({ ...r, businessName: businesses[i].name })))
              .sort((a, b) => new Date(b.createdAtUtc).getTime() - new Date(a.createdAtUtc).getTime());
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

  async confirmDelete(review: ReviewRow): Promise<void> {
    const preview = review.title ?? (review.comment ? review.comment.slice(0, 60) + (review.comment.length > 60 ? '…' : '') : null);
    const alert = await this.alertCtrl.create({
      header: 'Delete Review?',
      message: preview ? `"${preview}"` : 'This review will be permanently deleted.',
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Delete',
          role: 'destructive',
          cssClass: 'alert-btn-danger',
          handler: () => { this.executeDelete(review); },
        },
      ],
    });
    await alert.present();
  }

  private executeDelete(review: ReviewRow): void {
    if (review.actionLoading) return;
    review.actionLoading = true;
    this.reviewsApi.delete(review.id).subscribe({
      next: () => { this.reviews = this.reviews.filter(r => r.id !== review.id); },
      error: () => { review.actionLoading = false; },
    });
  }

  statusLabel(status: string): string {
    switch (status) {
      case 'Approved': return 'Approved';
      case 'Rejected': return 'Rejected';
      default: return 'Pending';
    }
  }
}
