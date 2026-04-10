import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { addIcons } from 'ionicons';
import { star, starOutline } from 'ionicons/icons';
import { AuthService } from '../../core/services/auth.service';
import { ReviewsApiService } from '../../features/reviews/services/reviews-api.service';
import { AppHeaderComponent } from '../../shared/components/app-header/app-header.component';
import { AppButtonComponent } from '../../shared/components/app-button/app-button.component';

@Component({
  selector: 'app-add-review',
  standalone: true,
  imports: [FormsModule, IonContent, IonIcon, TranslateModule, AppHeaderComponent, AppButtonComponent],
  templateUrl: './add-review.page.html',
  styleUrls: ['./add-review.page.scss'],
})
export class AddReviewPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly auth = inject(AuthService);
  private readonly reviewsApi = inject(ReviewsApiService);

  businessId = 0;
  rating = 0;
  comment = '';
  submitting = false;
  readonly stars = [1, 2, 3, 4, 5];

  constructor() {
    addIcons({ star, starOutline });
  }

  ngOnInit(): void {
    this.businessId = Number(this.route.snapshot.paramMap.get('businessId'));
  }

  setRating(value: number): void {
    this.rating = value;
  }

  submit(): void {
    const user = this.auth.currentUser;
    if (!user || this.rating === 0 || this.submitting) return;
    this.submitting = true;
    this.reviewsApi.create({
      businessId: this.businessId,
      appUserId: user.userId,
      rating: this.rating,
      title: null,
      comment: this.comment.trim() || null,
    }).subscribe({
      next: () => this.router.navigate(['/businesses', this.businessId]),
      error: () => { this.submitting = false; },
    });
  }
}
