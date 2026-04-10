import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { ReviewReaction } from '../models/review.model';

export interface CreateReviewReactionRequest {
  reviewId: number;
  appUserId: number;
  reactionType: number; // 1=Like
}

@Injectable({ providedIn: 'root' })
export class ReviewReactionsApiService {
  private readonly api = inject(ApiService);

  addReaction(request: CreateReviewReactionRequest): Observable<ReviewReaction> {
    return this.api.post<ReviewReaction>('/review-reactions', request);
  }

  removeReaction(id: number): Observable<void> {
    return this.api.delete<void>(`/review-reactions/${id}`);
  }

  getUserReactions(userId: number): Observable<ReviewReaction[]> {
    return this.api.get<ReviewReaction[]>(`/review-reactions/user/${userId}`);
  }
}
