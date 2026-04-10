export interface ReviewListItem {
  id: number;
  businessId: number;
  appUserId: number;
  rating: number;
  title: string | null;
  comment: string | null;
  status: string;
  createdAtUtc: string;
  likeCount: number;
}

export interface ReviewReaction {
  id: number;
  reviewId: number;
  appUserId: number;
  reactionType: number; // 1=Like, 2=Helpful, 3=Love
  createdAtUtc: string;
}

export interface ReviewDetail {
  id: number;
  businessId: number;
  appUserId: number;
  rating: number;
  title: string | null;
  comment: string | null;
  status: string;
  createdAtUtc: string;
  updatedAtUtc: string;
}

export interface CreateReviewRequest {
  businessId: number;
  appUserId: number;
  rating: number;
  title: string | null;
  comment: string | null;
}
