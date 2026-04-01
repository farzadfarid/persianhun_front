import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { CreateReviewRequest, ReviewDetail, ReviewListItem } from '../models/review.model';

@Injectable({ providedIn: 'root' })
export class ReviewsApiService {
  private readonly api = inject(ApiService);

  getByBusiness(businessId: number): Observable<ReviewListItem[]> {
    return this.api.get<ReviewListItem[]>(`/reviews/business/${businessId}`);
  }

  getByUser(userId: number): Observable<ReviewListItem[]> {
    return this.api.get<ReviewListItem[]>(`/reviews/user/${userId}`);
  }

  create(request: CreateReviewRequest): Observable<ReviewDetail> {
    return this.api.post<ReviewDetail>('/reviews', request);
  }
}
