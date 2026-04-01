import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonContent, IonIcon, IonSkeletonText } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { starOutline, star, chatbubbleOutline } from 'ionicons/icons';
import { AuthService } from '../../core/services/auth.service';
import { ReviewListItem } from '../../features/reviews/models/review.model';
import { ReviewsApiService } from '../../features/reviews/services/reviews-api.service';
import { AppHeaderComponent } from '../../shared/components/app-header/app-header.component';

@Component({
  selector: 'app-my-reviews',
  standalone: true,
  imports: [IonContent, IonIcon, IonSkeletonText, DatePipe, RouterLink, AppHeaderComponent],
  templateUrl: './my-reviews.page.html',
  styleUrls: ['./my-reviews.page.scss'],
})
export class MyReviewsPage implements OnInit {
  reviews: ReviewListItem[] = [];
  isLoading = true;
  hasError = false;

  readonly stars = [1, 2, 3, 4, 5];
  readonly skeletons = [1, 2, 3];

  constructor(
    private readonly auth: AuthService,
    private readonly reviewsApi: ReviewsApiService,
  ) {
    addIcons({ starOutline, star, chatbubbleOutline });
  }

  ngOnInit(): void {
    const user = this.auth.currentUser;
    if (!user) { this.isLoading = false; return; }

    this.reviewsApi.getByUser(user.userId).subscribe({
      next: (items) => {
        this.reviews = items.filter(r => r.status === 'Active');
        this.isLoading = false;
      },
      error: () => { this.hasError = true; this.isLoading = false; },
    });
  }
}
